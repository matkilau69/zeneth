import { GasNowSpeed, GasNowResponse } from './types';
import { BigNumber } from '@ethersproject/bignumber';

const jsonFetch = (url: string) => fetch(url).then((res) => res.json());

const stablecoins = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0xc00e94cb662c3520282e6f5717214004a7f26888', // DAI on Goerli
];

/**
 * @notice Takes a token address and returns the price in USD
 * @param tokenAddress Checksummed token address
 */
export const getTokenPriceInUsd = async (tokenAddress: string): Promise<number> => {
  try {
    // Return 1 for all stablecoins
    if (stablecoins.includes(tokenAddress)) return 1;

    // Otherwise fetch price and return it
    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`;
    const response: Record<string, { usd: number }> = await jsonFetch(coingeckoUrl);
    return response[tokenAddress].usd;
  } catch (e) {
    throw new Error(`Error fetching price for ${tokenAddress}: ${e.message as string}`);
  }
};

/**
 * @notice Returns eth price in USD
 */
export const getEthPriceInUsd = async (): Promise<number> => {
  try {
    const coingeckoUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    const response: Record<string, { usd: number }> = await jsonFetch(coingeckoUrl);
    return response.ethereum.usd;
  } catch (e) {
    throw new Error(`Error fetching price for ETH: ${e.message as string}`);
  }
};

/**
 * @notice Gets the current gas price via Gasnow API
 * @param gasPriceSpeed string of gas price speed from GasNow (e.g. `'rapid'`)
 */
export const getGasPrice = async (gasPriceSpeed: GasNowSpeed = 'rapid'): Promise<BigNumber> => {
  const gasPriceUrl = 'https://www.gasnow.org/api/v3/gas/price';
  try {
    const response: GasNowResponse = await jsonFetch(gasPriceUrl);
    const gasPriceInWei = response.data[gasPriceSpeed];
    return BigNumber.from(gasPriceInWei);
  } catch (e) {
    throw new Error(`Error on GasNow API: ${e.message as string}`);
  }
};

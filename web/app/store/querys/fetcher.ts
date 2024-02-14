import { type Fetcher } from 'swr';
import axios, { AxiosResponse } from 'axios';
import { httpErrorHandler } from '../../utils/http/http-error-handler';

const instance = axios.create();

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, httpErrorHandler);

// Refactor: fetcher 정리 필요, 각 요청별로 나누기
export const defaultFetcher: Fetcher<any, string> = (url) => instance.get(url).then((res) => res.data);

export const paramFetcher = (url: string, param: string) => instance.get(`${url}/${param}`).then((res) => res.data);

export const updateFetcher = async <RequestBody>(key: string | string[], { arg }: { arg: RequestBody }) => {
  const url = Array.isArray(key) ? key.join('/') : key;

  try {
    await instance.post(url, arg);
  } catch (e) {
    throw e;
  }
};

export const deleteFetcher = async (key: string | string[]) => {
  const url = Array.isArray(key) ? key.join('/') : key;
  try {
    await instance.delete(url);
  } catch (e) {
    throw e;
  }
};

export const fetchIndicatorsValue = async ([url, ...tickers]: string[]) => {
  const indicatorsvalue = await Promise.all(
    tickers.map((ticker) =>
      instance
        .get(url, {
          params: {
            ticker: ticker,
          },
        })
        .then((res) => res.data),
    ),
  );
  return { indicatorsValue: indicatorsvalue };
};

export const patchFetcher = async <T>(key: string[], { arg }: { arg: T }) => {
  const url = key.join('/');
  try {
    await instance.patch(url, arg);
  } catch (e) {
    throw e;
  }
};

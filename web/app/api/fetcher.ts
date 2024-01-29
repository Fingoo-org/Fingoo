import { type Fetcher } from 'swr';
import axios, { AxiosResponse } from 'axios';
import { httpErrorHandler } from '../utils/http/http-error-handler';

const instance = axios.create();

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, httpErrorHandler);

// fetcher 정리 필요
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

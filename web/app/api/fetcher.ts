import { type Fetcher } from 'swr';
import axios, { AxiosResponse } from 'axios';
import { httpErrorHandler } from '../utils/error/http-error-handler';

const instance = axios.create();

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, httpErrorHandler);

export const defaultFetcher: Fetcher<any, string> = (url) => instance.get(url).then((res) => res.data);

export async function updateFetcher<RequestBody>(url: string, { arg }: { arg: RequestBody }) {
  try {
    await instance.post(url, arg);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

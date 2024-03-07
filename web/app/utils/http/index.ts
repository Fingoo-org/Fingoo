import axios, { AxiosResponse } from 'axios';
import { httpErrorHandler } from './http-error-handler';

export const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, httpErrorHandler);

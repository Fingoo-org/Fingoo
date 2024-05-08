import axios, { AxiosResponse } from 'axios';
import { httpErrorHandler } from './http-error-handler';
import Cookies from 'js-cookie';

export const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, httpErrorHandler);

instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 요청이 전달되기 전에 작업 수행
    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);

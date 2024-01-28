import axios, { AxiosError, HttpStatusCode } from 'axios';
import { BadRequestError } from './http-error';

export const httpErrorHandler = (error: AxiosError | Error) => {
  let promiseError: Promise<Error>;

  if (axios.isAxiosError(error)) {
    const { response } = error;

    switch (response?.status) {
      case HttpStatusCode.BadRequest:
        promiseError = Promise.reject(new BadRequestError());
        break;
      default:
        promiseError = Promise.reject(new Error());
    }
  } else {
    promiseError = Promise.reject(error);
  }

  return promiseError;
};

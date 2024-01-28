import axios, { AxiosError } from 'axios';
import { BadRequestError } from './http-error';

export const httpErrorHandler = (error: AxiosError | Error) => {
  let promiseError: Promise<Error>;

  if (axios.isAxiosError(error)) {
    const { response } = error;

    if (response) {
      const { status } = response;

      switch (status) {
        case 400:
          promiseError = Promise.reject(new BadRequestError());
          break;
        default:
          promiseError = Promise.reject(new Error());
      }
    } else {
      promiseError = Promise.reject(error);
    }
  } else {
    promiseError = Promise.reject(error);
  }

  return promiseError;
};

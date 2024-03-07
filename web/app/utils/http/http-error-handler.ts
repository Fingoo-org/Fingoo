import axios, { AxiosError, HttpStatusCode } from 'axios';
import {
  BadRequestError,
  ForbiddenError,
  HttpError,
  NetworkError,
  NotFoundError,
  TimeoutError,
  UnauthorizedError,
  InternetServerError,
} from './http-error';

export interface ErrorResponseData {
  statusCode: number;
  errorMessage: string;
  descritpion: string;
  timestamp: Date | string;
  url: string;
}

export const httpErrorHandler = (error: AxiosError<ErrorResponseData> | Error) => {
  let promiseError: Promise<Error>;

  if (axios.isAxiosError(error)) {
    if (Object.is(error.code, 'ECONNABORTED')) {
      promiseError = Promise.reject(new TimeoutError());
    } else if (Object.is(error.message, 'Network Error')) {
      promiseError = Promise.reject(new NetworkError());
    } else {
      const { response } = error as AxiosError<ErrorResponseData>;
      const status = response?.status;
      const message = response?.data.errorMessage;

      switch (status) {
        case HttpStatusCode.Unauthorized:
          promiseError = Promise.reject(
            new UnauthorizedError({
              message,
              response,
            }),
          );
          break;
        case HttpStatusCode.BadRequest:
          promiseError = Promise.reject(
            new BadRequestError({
              message,
              response,
            }),
          );
          break;
        case HttpStatusCode.Forbidden:
          promiseError = Promise.reject(
            new ForbiddenError({
              message,
              response,
            }),
          );
          break;
        case HttpStatusCode.NotFound:
          promiseError = Promise.reject(
            new NotFoundError({
              message,
              response,
            }),
          );
          break;
        case HttpStatusCode.InternalServerError:
          promiseError = Promise.reject(
            new InternetServerError({
              message,
              response,
            }),
          );
          break;
        default:
          promiseError = Promise.reject(new HttpError(status, message, response));
      }
    }
  } else {
    promiseError = Promise.reject(error);
  }

  return promiseError;
};

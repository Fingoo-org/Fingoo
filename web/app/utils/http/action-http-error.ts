import { BadRequestError } from './http-error';

export const onActionHttpError = (error: unknown) => {
  if (error instanceof BadRequestError) {
    // 에러 처리 로직
  }
};

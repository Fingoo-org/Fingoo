import { BadRequestError } from './http-error';

export const onActionHttpError = (error: unknown) => {
  if (error instanceof BadRequestError) {
    console.log(error);
    alert('잘못된 요청입니다.');
  }
};

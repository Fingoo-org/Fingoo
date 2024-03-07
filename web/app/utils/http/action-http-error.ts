import {
  NetworkError,
  TimeoutError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from './http-error';

export const onActionHttpError = (error: unknown) => {
  if (error instanceof NotFoundError || error instanceof ForbiddenError) {
    // 해당 에러는 여기서 처리하지 않음
    return;
  }

  if (error instanceof UnauthorizedError) {
    // 권한 처리 로직
  } else if (error instanceof NetworkError) {
    // 잘못된 요청 처리 로직
  } else if (error instanceof TimeoutError) {
    // 타임아웃 처리 로직
  } else if (error instanceof BadRequestError) {
    // 잘못된 요청 처리 로직
  }
};

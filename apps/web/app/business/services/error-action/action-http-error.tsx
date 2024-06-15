import { Toast } from '@/app/ui/components/view/hooks/use-toast';
import {
  NetworkError,
  TimeoutError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  InternetServerError,
  HttpError,
} from '../../../utils/http/http-error';
import { ToastAction } from '@/app/ui/components/view/molecule/toast/toast';
import Link from 'next/link';

export const onActionHttpError = (toast: (props: Toast) => any, error: unknown) => {
  console.log(error);
  if (error instanceof NotFoundError || error instanceof ForbiddenError) {
    // 해당 에러는 여기서 처리하지 않음
    return;
  }
  if (error instanceof HttpError && error.response?.config.method === 'get') {
    // get error는 에러 바운더리에서 처리, 일단 임시로 처리
    if (error instanceof UnauthorizedError) {
      toast({
        variant: 'destructive',
        description: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
        action: (
          <ToastAction
            onClick={() => {
              window.location.href = '/';
            }}
            altText="to Login"
          >
            로그인
          </ToastAction>
        ),
      });
    }

    return;
  }

  if (error instanceof UnauthorizedError) {
    // 권한 처리 로직
    console.log('권한이 없습니다.');
  } else if (error instanceof NetworkError) {
    // 잘못된 요청 처리 로직
    toast({
      variant: 'destructive',
      description: '네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
    });
  } else if (error instanceof TimeoutError) {
    // 타임아웃 처리 로직
    toast({
      variant: 'destructive',
      description: '네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
    });
  } else if (error instanceof BadRequestError) {
    // 잘못된 요청 처리 로직
    toast({
      variant: 'destructive',
      description: error.message,
    });
  } else if (error instanceof InternetServerError) {
    // 서버 에러 처리 로직
    toast({
      variant: 'destructive',
      description: '서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  } else if (error instanceof HttpError) {
    toast({
      variant: 'destructive',
      description: error.message,
    });
  } else {
    // 그 외의 에러 처리 로직
    toast({
      variant: 'destructive',
      description: '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};

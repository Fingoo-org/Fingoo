import { Toast } from '@/app/ui/components/view/hooks/use-toast';
import {
  NetworkError,
  TimeoutError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '../../../utils/http/http-error';

export const onActionHttpError = (toast: (props: Toast) => any, error: unknown) => {
  if (error instanceof NotFoundError || error instanceof ForbiddenError) {
    // 해당 에러는 여기서 처리하지 않음
    return;
  }

  if (error instanceof UnauthorizedError) {
    // 권한 처리 로직
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
      description: '네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};

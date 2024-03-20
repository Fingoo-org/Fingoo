import { calculateIsPending } from '@/app/utils/helper';
import { useRef } from 'react';

export function usePending(isValidating: boolean, isMutating: boolean) {
  const isPending = useRef(false);

  isPending.current = calculateIsPending(isValidating, isMutating);

  return {
    isPending: isPending.current,
  };
}

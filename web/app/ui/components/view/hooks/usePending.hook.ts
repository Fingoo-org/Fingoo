import { useRef } from 'react';

export function usePending(isValidating: boolean, isMutating: boolean) {
  const isTriggeredMutation = useRef(false);
  const isPending = useRef(false);

  if (isMutating) {
    isTriggeredMutation.current = true;
  }
  console.log('cached', isTriggeredMutation.current);

  if (isMutating) {
    isPending.current = true;
  } else {
    if (isTriggeredMutation.current === false) {
      isPending.current = false;
    } else {
      isPending.current = true;
      if (isValidating === true) {
        isTriggeredMutation.current = false;
      }
    }
  }

  return {
    isPending: isPending.current,
  };
}

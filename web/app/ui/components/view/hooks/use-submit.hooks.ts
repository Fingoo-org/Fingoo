import React, { useRef, type RefObject } from 'react';

type SubmitProps = {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function useSubmit(): SubmitProps {
  const formRef = useRef<HTMLFormElement>(null);

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: handleEnterKeyDown };
}

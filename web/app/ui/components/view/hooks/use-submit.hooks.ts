import React, { useRef, type RefObject } from 'react';

type SubmitProps = {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function useSubmit(): SubmitProps {
  const formRef = useRef<HTMLFormElement>(null);

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: handleEnterKeyDown };
}

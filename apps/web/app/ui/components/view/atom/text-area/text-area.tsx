import React, { useRef, useEffect } from 'react';
import { cn } from '@/app/utils/style';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  backgroundColor?: string;
  textColor?: string;
  minRows?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, backgroundColor = 'transparent', textColor = 'inherit', minRows = 1, value = '', ...props },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const textarea = localRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value]);

    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(localRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = localRef.current;
      }
    }, [forwardedRef]);

    return (
      <textarea
        className={cn(
          'w-full resize-none border-none p-0 focus:outline-none focus:ring-0 focus:ring-offset-0',
          'text-base leading-relaxed',
          className,
        )}
        ref={localRef}
        style={{
          backgroundColor,
          color: textColor,
          minHeight: `${minRows * 1}rem`,
        }}
        value={value}
        {...props}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

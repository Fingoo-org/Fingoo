'use client';
import React, { useEffect, useRef, useState } from 'react';
import IconButton from './icon-button/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';
import { useDebouncedCallback } from 'use-debounce';
import { twMerge } from 'tailwind-merge';

type EditableTextProps = {
  defaultValue: string;
  readonly?: boolean;
  inputKey?: string;
  withResetButton?: boolean;
  withDebounce?: number;
  className?: string;
  onChangeValue?: (value: string) => void;
};

export default function EditableText({
  defaultValue,
  readonly = false,
  inputKey,
  withResetButton,
  withDebounce = 0,
  className,
  onChangeValue,
}: EditableTextProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (value === defaultValue) {
      return;
    }
    setValue(defaultValue);
  }, [inputKey, defaultValue]);

  const handleValueChangeWithDebounce = useDebouncedCallback((name: string) => {
    onChangeValue?.(name);
  }, withDebounce);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setValue(value);
    handleValueChangeWithDebounce(value);
  };

  const handleReset = () => {
    setValue('');
    onChangeValue?.('');
  };

  return (
    <div className="inline-block relative group">
      <div className="flex items-center">
        <div
          className={twMerge(
            'before:w-0 before:h-[1px] before:absolute before:z-10 before:opacity-0 before:bg-blue-400 before:bottom-0 before:right-1/2 before:ease-in before:duration-200',
            'has-[:hover]:before:w-1/2 has-[:hover]:before:opacity-100 has-[:focus]:before:w-1/2 has-[:focus]:before:opacity-100 has-[:focus]:has-[:read-only]:before:w-0',
            'has-[:hover]:has-[:read-only]:before:w-0 after:w-0 after:h-[1px] after:absolute after:z-10 after:opacity-0 after:bg-blue-400 after:bottom-0 after:left-1/2 after:ease-in after:duration-200 has-[:hover]:after:w-1/2 has-[:hover]:after:opacity-100 has-[:focus]:after:w-1/2 has-[:focus]:after:opacity-100',
            'has-[:focus]:has-[:read-only]:after:w-0 has-[:hover]:has-[:read-only]:after:w-0',
          )}
        >
          <input
            ref={ref}
            readOnly={readonly}
            key={inputKey}
            value={value}
            onChange={handleChange}
            className={twMerge('py-1 pr-2 focus:outline-none border-0 focus:ring-0 focus:ring-offset-0', className)}
          />
        </div>
        <div
          onClick={() => {
            ref.current?.focus();
            withResetButton && !readonly ? handleReset() : null;
          }}
        >
          {withResetButton && !readonly ? (
            <IconButton
              className="invisible group-has-[:focus]:visible"
              color={'gray'}
              icon={XCircleIcon}
              size={'xs'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

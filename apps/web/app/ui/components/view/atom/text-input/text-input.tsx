'use client';
import React from 'react';
import { cn } from '@/app/utils/style';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { getInputColors } from '@/app/utils/style/helper';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'number';
  defaultValue?: string | number;
  value?: string | number;
  icon?: React.ElementType;
  error?: boolean;
  errorMessages?: string[];
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    type,
    defaultValue,
    value,
    icon,
    error = false,
    errorMessages,
    disabled = false,
    placeholder,
    className,
    onValueChange,
    ...props
  },
  ref,
) {
  const Icon = icon;

  return (
    <>
      <div
        className={cn(
          'relative flex w-full min-w-[10rem] items-center rounded-lg border outline-none transition duration-100',
          'shadow-sm',
          getInputColors(disabled, error),
          'has-[:focus]:ring-2',
          'has-[:focus]:border-blue-400 has-[:focus]:ring-blue-200',
          className,
        )}
      >
        {Icon ? <Icon className="text-gray-6 ml-2.5 h-5 w-5 shrink-0" /> : null}
        <input
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          value={value}
          type={type}
          className={cn(
            'w-full rounded-lg border-none bg-transparent py-2 text-sm transition duration-100 focus:outline-none focus:ring-0',
            'text-black-1',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            Icon ? 'pl-2' : 'pl-3',
            error ? 'pr-9' : 'pr-3',
            disabled ? 'text-gray-6 placeholder:text-gray-6' : 'placeholder:text-gray-6',
          )}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            onValueChange?.(e.target.value);
          }}
        />
        {error ? (
          <ExclamationCircleIcon
            className={cn('text-etc-red absolute right-0 flex h-5 w-5 shrink-0 items-center', 'mr-3')}
          />
        ) : null}
      </div>
      {error && errorMessages
        ? errorMessages.map((message, index) => (
            <p key={index} className={cn('text-etc-red mt-1 text-sm')}>
              {message}
            </p>
          ))
        : null}
    </>
  );
});

export default TextInput;

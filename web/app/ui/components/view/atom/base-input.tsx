'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export const getInputColors = (isDisabled: boolean, hasError = false) => {
  return twMerge(
    isDisabled ? 'bg-gray-100' : 'bg-white',
    !isDisabled && 'hover:bg-gray-50',
    isDisabled && 'bg-gray-100',
    hasError && 'text-red-500',
    hasError ? 'border-red-500' : 'border-gray-200',
  );
};

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password';
  defaultValue?: string;
  value?: string;
  icon?: React.ElementType;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onValueChange?: (value: unknown) => void;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(function BaseInput(
  {
    type,
    defaultValue,
    value,
    icon,
    error = false,
    errorMessage,
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
        className={twMerge(
          'relative w-full flex items-center min-w-[10rem] outline-none rounded-lg transition duration-100 border',
          'shadow-sm',
          'text-sm',
          getInputColors(disabled, error),
          'has-[:focus]:ring-2',
          'has-[:focus]:border-blue-400 has-[:focus]:ring-blue-200',
          className,
        )}
      >
        {Icon ? <Icon className="shrink-0 h-5 w-5 ml-2.5 text-gray-400" /> : null}
        <input
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          value={value}
          type={type}
          className={twMerge(
            'w-full focus:outline-none focus:ring-0 border-none bg-transparent rounded-lg transition duration-100 py-2',
            'text-color-gray-700',
            'text-custom-inherit',
            Icon ? 'pl-2' : 'pl-3',
            error ? 'pr-3' : 'pr-4',
            disabled ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500',
          )}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            onValueChange?.(e.target.value);
          }}
        />
      </div>
      {error && errorMessage ? <p className={twMerge('text-sm text-red-500 mt-1')}>{errorMessage}</p> : null}
    </>
  );
});

export default BaseInput;

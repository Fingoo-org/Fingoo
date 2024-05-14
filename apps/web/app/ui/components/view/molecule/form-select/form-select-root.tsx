import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import React, { useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { getInputColors } from '@/app/utils/style';

export interface FormSelectProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder: string;
  defaultValue?: string;
  name?: string;
  icon?: React.ElementType;
  error?: boolean;
  errorMessages?: string[];
  disabled?: boolean;
  children?: React.ReactNode;
  required?: boolean;
  onValueChange?: (value: unknown) => void;
}

export const FormSelectRoot = React.forwardRef<HTMLInputElement, FormSelectProps>(function Select(
  {
    defaultValue,
    icon,
    error = false,
    errorMessages,
    disabled = false,
    name,
    children,
    placeholder,
    id,
    required,
    onValueChange,
  },
  ref,
) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const listboxButtonRef = useRef<HTMLButtonElement | null>(null);
  const childrenArray = React.Children.toArray(children);
  const Icon = icon;

  const selectedPlaceholder = useMemo(() => {
    const reactElementChildren = React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && child.props.value === selectedValue,
    );
    return reactElementChildren.length > 0
      ? (reactElementChildren[0] as React.ReactElement).props.placeholder
      : placeholder;
  }, [selectedValue, children]);

  return (
    <div className="relative w-full text-base">
      <select
        required={required}
        title="select-hidden"
        className={twMerge('absolute left-0 top-0 z-0 h-full w-full opacity-0')}
        value={selectedValue}
        onChange={(e) => {
          e.preventDefault();
          onValueChange?.(e.target.value);
          setSelectedValue(e.target.value);
        }}
        name={name}
        disabled={disabled}
        id={id}
        onFocus={() => {
          const listboxButton = listboxButtonRef.current;
          if (listboxButton) listboxButton.focus();
        }}
      >
        <option className="hidden" value="" hidden>
          {placeholder}
        </option>
        {childrenArray.map((child: any) => {
          const value = child.props.value;
          const placeholder = child.props.placeholder;
          return (
            <option className="hidden" key={value} value={value}>
              {placeholder}
            </option>
          );
        })}
      </select>
      <Listbox
        as="div"
        ref={ref}
        value={selectedValue ?? ''}
        onChange={(value: string) => {
          onValueChange?.(value);
          setSelectedValue(value);
        }}
        disabled={disabled}
        className="relative"
      >
        <Listbox.Button
          ref={listboxButtonRef}
          className={twMerge(
            'w-full  truncate whitespace-nowrap rounded-xl border py-2 pr-8 text-left outline-none transition duration-100 focus:ring-2',
            'border-gray-800 text-gray-700 shadow-sm focus:border-blue-400 focus:ring-blue-200',
            Icon ? 'pl-10' : 'pl-3',
            getInputColors(disabled, error),
          )}
        >
          {Icon && (
            <span className="absolute inset-y-0 left-0 ml-px flex items-center pl-2.5">
              <Icon className={twMerge('h-5 w-5 flex-none', 'text-gray-600')} />
            </span>
          )}
          <span className={twMerge('block truncate p-0', disabled && 'text-gray-6')}>{selectedPlaceholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 mr-3 flex items-center">
            <ChevronDownIcon className={twMerge('h-5 w-5 flex-none', 'text-gray-400')} />
          </span>
        </Listbox.Button>

        <Transition
          className="absolute z-10 w-full"
          enter="transition ease duration-100 transform"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease duration-100 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
        >
          <Listbox.Options
            className={twMerge(
              'left-0 my-1 max-h-[228px] divide-y overflow-y-auto rounded-lg border outline-none',
              'divide-gray-200 border-gray-200 bg-white shadow-md	',
            )}
          >
            {children}
          </Listbox.Options>
        </Transition>
      </Listbox>
      {error && errorMessages
        ? errorMessages.map((message, index) => (
            <p key={index} className={twMerge('text-etc-red mt-1 text-sm')}>
              {message}
            </p>
          ))
        : null}
    </div>
  );
});

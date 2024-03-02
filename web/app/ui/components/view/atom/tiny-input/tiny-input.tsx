import IconButton from '../icons/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Icon from '../icons/variant-icon';
import { Color, cn, getColorClassNames } from '@/app/utils/style';

// Refactor: value가 맞지 않니?
type TinyInputProps = {
  defaultValue: string;
  withResetButton?: boolean;
  withDebounce?: number;
  icon?: React.ElementType;
  color?: Color;
  onValueChange?: (value: string) => void;
};

export default function TinyInput({
  defaultValue,
  withResetButton = false,
  withDebounce = 0,
  icon,
  color = 'gray',
  onValueChange,
}: TinyInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (value === defaultValue) {
      return;
    }
    setValue(defaultValue);
  }, [defaultValue]);

  const handleValueChangeWithDebounce = useDebouncedCallback((value: string) => {
    onValueChange?.(value);
  }, withDebounce);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    handleValueChangeWithDebounce(value);
  };

  const handleReset = () => {
    setValue('');
    onValueChange?.('');
  };

  return (
    <div
      className={cn(
        'has=[:focus]:ring-blue-200 flex w-full rounded-lg text-sm duration-100 has-[:focus]:ring-2 ',
        getColorClassNames(color, 100).bgColor,
      )}
    >
      {icon ? <Icon icon={icon} size={'xs'} color={'gray'} /> : null}
      <input
        value={value}
        onChange={handleChange}
        className={cn(
          'w-full rounded-lg border-none p-0 py-0.5 pl-2 text-custom-inherit focus:outline-none focus:ring-0 focus:ring-offset-0',
          icon ? 'pl-0' : 'pl-2',
          getColorClassNames(color, 100).bgColor,
        )}
      />
      {withResetButton ? <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleReset} /> : null}
    </div>
  );
}

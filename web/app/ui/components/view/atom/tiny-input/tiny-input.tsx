import IconButton from '../icon-button/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type TinyInputProps = {
  defaultValue: string;
  withResetButton?: boolean;
  withDebounce?: number;
  onValueChange?: (value: string) => void;
};

export default function TinyInput({
  defaultValue,
  withResetButton = false,
  withDebounce = 0,
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
    <div className="has=[:focus]:ring-blue-200 flex w-full rounded-lg bg-gray-100 text-sm duration-100 has-[:focus]:ring-2 ">
      <input
        value={value}
        onChange={handleChange}
        className=" w-full rounded-lg border-none bg-gray-100 p-0 py-0.5 pl-2 text-custom-inherit focus:outline-none focus:ring-0 focus:ring-offset-0"
      />
      {withResetButton ? <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleReset} /> : null}
    </div>
  );
}

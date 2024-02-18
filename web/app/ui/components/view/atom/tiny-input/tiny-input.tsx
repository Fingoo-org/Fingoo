import IconButton from '../icon-button/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';

type TinyInputProps = {
  value: string;
  withResetButton?: boolean;
  onValueChange?: (value: string) => void;
};

export default function TinyInput({ value, withResetButton = false, onValueChange }: TinyInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onValueChange?.(value);
  };

  const handleReset = () => {
    onValueChange?.('');
  };

  return (
    <div className="bg-gray-100	 flex w-full rounded-lg text-sm has-[:focus]:ring-2 has=[:focus]:ring-blue-200 duration-100 ">
      <input
        value={value}
        onChange={handleChange}
        className=" bg-gray-100	 pl-2 py-0.5 focus:outline-none rounded-lg text-custom-inherit focus:ring-0 focus:ring-offset-0 border-none w-full p-0"
      />
      {withResetButton ? <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleReset} /> : null}
    </div>
  );
}

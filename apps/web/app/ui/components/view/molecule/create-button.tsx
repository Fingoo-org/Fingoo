import { Loader2, PlusIcon } from 'lucide-react';
import Button from '../atom/button/button';
import React from 'react';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  label: string;
}

const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(function CreateButton(
  { label, isLoading, ...props }: CreateButtonProps,
  ref,
) {
  return (
    <Button
      ref={ref}
      {...props}
      color={'slate'}
      variant={'light'}
      className="rounded-lg bg-fingoo-gray-1.5 px-2 py-1 text-fingoo-gray-5"
    >
      {isLoading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4 pr-1 font-semibold" />
      )}
      {label}
    </Button>
  );
});

export default CreateButton;

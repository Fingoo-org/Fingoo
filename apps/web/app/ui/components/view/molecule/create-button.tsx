import { Loader2, PlusIcon } from 'lucide-react';
import Button from '../atom/button/button';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  label: string;
}

export default function CreateButton({ label, isLoading, ...props }: CreateButtonProps) {
  return (
    <Button
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
}

import { useContext } from 'react';
import { DialogMenuContext } from './dialog-menu.context';
import { useDialog } from '../../hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type DialogMenuItemProps = {
  icon: React.ElementType;
  onClick: (payload: unknown) => void;
} & NativeButtonType;

export function DialogMenuItem({ children, icon, onClick, ...props }: React.PropsWithChildren<DialogMenuItemProps>) {
  const dialogKey = useContext(DialogMenuContext);
  const { payload, closeDialog } = useDialog(dialogKey as DialogKey);
  const Icon = icon;

  const handleClick = () => {
    // write logic
    if (onClick) {
      onClick(payload);
    }

    closeDialog();
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      role="menuitem"
      className="group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
    >
      <Icon className="mr-2 h-4 w-4 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}

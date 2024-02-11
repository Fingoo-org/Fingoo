import { useContext } from 'react';
import { DialogMenuContext } from './dialog-menu.context';
import { useDialogMenu } from './use-dialog-menu.hook';
import { DialogMenuKey } from '@/app/utils/keys/dialog-menu-key';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> & {
  onClick: (data: string) => void;
};

type DialogMenuItemProps = {
  icon: React.ElementType;
  onClick?: () => void;
} & NativeButtonType;

export function DialogMenuItem({ children, icon, onClick, ...props }: React.PropsWithChildren<DialogMenuItemProps>) {
  const dialogKey = useContext(DialogMenuContext);
  const { closeDialogMenu } = useDialogMenu(dialogKey as DialogMenuKey);
  const Icon = icon;

  const handleClick = () => {
    // write logic
    if (onClick) {
      onClick();
    }

    closeDialogMenu();
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
    >
      <Icon className="w-5 h-5 mr-2 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}

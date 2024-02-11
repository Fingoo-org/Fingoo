import { useContext } from 'react';
import { DialogMenuContext } from './dialog-menu.context';

type DialogMenuItemProps = {
  icon: React.ElementType;
  onClick?: () => void;
};

export function DialogMenuItem({ children, icon, onClick }: React.PropsWithChildren<DialogMenuItemProps>) {
  const { onClose } = useContext(DialogMenuContext);
  const Icon = icon;

  const handleClick = () => {
    // write logic
    if (onClick) {
      onClick();
    }

    onClose();
  };

  return (
    <button
      onClick={handleClick}
      className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
    >
      <Icon className="w-5 h-5 mr-2 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}

import { useContext } from 'react';
import { DialogMenuContext } from './dialog-menu.context';
import { useDialog } from '../../hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';

type DialogMenuContentProps = {};

export function DialogMenuContent({ children }: React.PropsWithChildren<DialogMenuContentProps>) {
  const dialogKey = useContext(DialogMenuContext);
  const { payload } = useDialog(dialogKey as DialogKey);

  return <div className="px-4 py-2">{children}</div>;
}

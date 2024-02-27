import { DialogMenuRoot } from './dialog-menu-root';
import { DialogMenuItem } from './dialog-menu-item';
import { DialogMenuHeader } from './dialog-menu-header';
export { useDialog } from '../../hooks/use-dialog.hook';

const DialogMenu = Object.assign(DialogMenuRoot, {
  Header: DialogMenuHeader,
  Item: DialogMenuItem,
});

export default DialogMenu;

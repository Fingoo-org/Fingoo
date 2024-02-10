import { DialogMenuRoot } from './dialog-menu-root';
import { DialogMenuItem } from './dialog-menu-item';
export { useDialogMenu } from './use-dialog-menu.hook';

const DialogMenu = Object.assign(DialogMenuRoot, {
  Item: DialogMenuItem,
});

export default DialogMenu;

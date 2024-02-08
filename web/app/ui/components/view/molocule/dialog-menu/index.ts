import DialogMenuRoot from './dialog-menu-root';
import DialogMenuItem from './dialog-menu-item';

const DialogMenu = Object.assign(DialogMenuRoot, {
  Item: DialogMenuItem,
});

export default DialogMenu;

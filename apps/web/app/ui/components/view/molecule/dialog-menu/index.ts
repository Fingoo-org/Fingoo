import { DialogMenuRoot } from './dialog-menu-root';
import { DialogMenuItem } from './dialog-menu-item';
import { DialogMenuHeader } from './dialog-menu-header';
import { DialogMenuContent } from './dialog-menu-content';

const DialogMenu = Object.assign(DialogMenuRoot, {
  Header: DialogMenuHeader,
  Item: DialogMenuItem,
  Content: DialogMenuContent,
});

export default DialogMenu;

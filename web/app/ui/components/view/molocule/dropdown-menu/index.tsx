import { DropdownMenuRoot } from './dropdown-menu-root';
import { DropdownMenuButton } from './dropdown-menu-button';
import { DropdownMenuItem } from './dropdown-menu-item';

const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Button: DropdownMenuButton,
  Item: DropdownMenuItem,
});

export default DropdownMenu;

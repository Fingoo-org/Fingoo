import { SideNavigationBarRoot } from './side-navigation-bar-root';
import { SideNavigationBarContent } from './side-navigation-bar-content';
import { SideNavigationBarMenu } from './side-navigation-bar-menu';

const SideNavigationBar = Object.assign(SideNavigationBarRoot, {
  Content: SideNavigationBarContent,
  Menu: SideNavigationBarMenu,
});

export default SideNavigationBar;

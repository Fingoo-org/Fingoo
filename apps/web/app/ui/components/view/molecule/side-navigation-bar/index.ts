import { SideNavigationBarRoot } from './side-navigation-bar-root';
import { SideNavigationBarContent } from './side-navigation-bar-content';

const SideNavigationBar = Object.assign(SideNavigationBarRoot, {
  Content: SideNavigationBarContent,
});

export default SideNavigationBar;

import { TabsRoot } from './tabs-root';
import { TabsList } from './tabs-list';
import { TabsContent } from './tabs-content';
import { TabsTrigger } from './tabs-trigger';

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Content: TabsContent,
  Trigger: TabsTrigger,
});

export default Tabs;

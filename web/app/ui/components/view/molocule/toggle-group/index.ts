import { ToggleGroupRoot } from './toggle-group-root';
import { ToggleGroupItem } from './toggle-group-item';

const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});

export default ToggleGroup;

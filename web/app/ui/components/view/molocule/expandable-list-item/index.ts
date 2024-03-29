import { ExpandableListItemRoot } from './expandable-list-item-root';
import { ExpandableListItemExpandedContent } from './expandable-list-item-expanded-content';
import { ExpandableListItemTitle } from './expandable-list-item-title';

const ExpandableListItem = Object.assign(ExpandableListItemRoot, {
  Title: ExpandableListItemTitle,
  ExpandedContent: ExpandableListItemExpandedContent,
});

export default ExpandableListItem;

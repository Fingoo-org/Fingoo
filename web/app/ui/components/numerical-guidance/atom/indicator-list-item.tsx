import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectableItem from '../../view/atom/selectable-item';
import { Indicator } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import ListItem from '../../view/atom/list-item';

type IndicatorListItemProps = {
  item: Indicator;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.indicators?.some((i) => i.ticker === item.ticker) || false;
  const handleItemSelect = () => addIndicatorToMetadata(item);
  const handleItemDeSelect = () => deleteIndicatorFromMetadata(item.ticker);

  return (
    <ListItem style={style}>
      <SelectableItem
        onSelect={handleItemSelect}
        onDeSelect={handleItemDeSelect}
        key={item.ticker}
        selected={isSelected}
      >
        {item.name}
      </SelectableItem>
    </ListItem>
  );
}

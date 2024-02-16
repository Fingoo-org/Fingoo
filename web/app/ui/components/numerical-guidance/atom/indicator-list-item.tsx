import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import { IndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import SelectableListItem from '../../view/atom/selectable-list-item';

type IndicatorListItemProps = {
  item: IndicatorResponse;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.indicators?.some((i) => i.ticker === item.ticker) || false;
  const handleItemSelect = () => addIndicatorToMetadata(item);
  const handleItemDeSelect = () => deleteIndicatorFromMetadata(item.ticker);

  return (
    <div className="h-12">
      <SelectableListItem
        onSelect={handleItemSelect}
        onDeSelect={handleItemDeSelect}
        key={item.ticker}
        style={style}
        selected={isSelected}
      >
        {item.name}
      </SelectableListItem>
    </div>
  );
}

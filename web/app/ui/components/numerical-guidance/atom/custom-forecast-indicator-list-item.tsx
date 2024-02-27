import { CustomForecastIndicator } from '@/app/business/services/view-model/custom-forecast-indicator-view-model.service';
import ListItem from '../../view/atom/list-item';
import IconButton from '../../view/atom/icons/icon-button';
import SelectableItem from '../../view/atom/selectable-item';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

type CustomForecastIndicatorListItemProps = {
  item: CustomForecastIndicator;
};

export default function CustomForecastIndicatorListItem({ item }: CustomForecastIndicatorListItemProps) {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.customForecastIndicatorIds?.some((id) => id === item.targetIndicatorId) || false;

  const handleSelect = () => {
    console.log('select');
  };
  return (
    <ListItem
    // withHoverComponent={
    //   <IconButton
    //     aria-label="edit"
    //     ref={iconButtonRef}
    //     onClick={handleIconButton}
    //     icon={DotsHorizontalIcon}
    //     color={'violet'}
    //   />
    // }
    >
      <SelectableItem key={item.id} selected={isSelected} onSelect={handleSelect}>
        {item.name}
      </SelectableItem>
    </ListItem>
  );
}

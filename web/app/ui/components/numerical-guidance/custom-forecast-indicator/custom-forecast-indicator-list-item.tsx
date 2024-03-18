import { CustomForecastIndicator } from '@/app/business/services/view-model/custom-forecast-indicator-view-model.service';
import ListItem from '../../view/atom/list-item';
import IconButton from '../../view/atom/icons/icon-button';
import SelectableItem from '../../view/atom/selectable-item';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';

type CustomForecastIndicatorListItemProps = {
  item: CustomForecastIndicator;
};

export default function CustomForecastIndicatorListItem({ item }: CustomForecastIndicatorListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(
    DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU,
  );
  const { selectCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();

  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.customForecastIndicatorIds?.some((id) => id === item.targetIndicatorId) || false;

  const handleSelect = () => {
    console.log('select');
  };

  const handleIconButton = () => {
    selectCustomForecastIndicator(item.id);
    openDialogWithPayload(item);
  };

  const hoverRender = () => {
    return (
      <IconButton
        aria-label="edit"
        ref={iconButtonRef}
        onClick={handleIconButton}
        icon={DotsHorizontalIcon}
        color={'violet'}
      />
    );
  };

  return (
    <ListItem hoverRender={hoverRender}>
      <SelectableItem key={item.id} selected={isSelected} onSelect={handleSelect}>
        {item.name}
      </SelectableItem>
    </ListItem>
  );
}

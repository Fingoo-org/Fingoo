import { CustomForecastIndicator } from '@/app/business/services/view-model/custom-forecast-indicator-view-model.service';
import ListItem from '../../../view/atom/list-item';
import IconButton from '../../../view/atom/icons/icon-button';
import SelectableItem from '../../../view/atom/selectable-item';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import ExpandableListItem from '../../../view/molecule/expandable-list-item';
import { useSourceIndicator } from '@/app/business/hooks/custom-forecast-indicator/use-source-indicator.hook';

type CustomForecastIndicatorListItemProps = {
  item: CustomForecastIndicator;
};

export default function CustomForecastIndicatorListItem({ item }: CustomForecastIndicatorListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(
    DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU,
  );
  const { selectCustomForecastIndicatorById } = useSelectedCustomForecastIndicatorViewModel();
  const { selectedMetadata, addCustomForecastIndicatorToMetadata, deleteCustomForecastIndicatorFromMetadata } =
    useSelectedIndicatorBoardMetadata();

  const { sourceIndicatorList } = useSourceIndicator(item.id);

  const isSelected = selectedMetadata?.customForecastIndicatorIds?.some((id) => id === item.id) || false;

  const handleCustomForecastIndicatorAddToMetadata = () => {
    addCustomForecastIndicatorToMetadata(item.id);
  };

  const handleCustomForecastIndicatorDeleteFromMetadata = () => {
    deleteCustomForecastIndicatorFromMetadata(item.id);
  };

  const handleCustomForecastIndicatorSelect = () => {
    selectCustomForecastIndicatorById(item.id);
    openDialogWithPayload(item);
  };

  const hoverRender = () => {
    return (
      <IconButton
        aria-label="edit"
        ref={iconButtonRef}
        onClick={handleCustomForecastIndicatorSelect}
        icon={DotsHorizontalIcon}
        color={'violet'}
        className="mr-5"
      />
    );
  };

  return (
    <ExpandableListItem
      selected={isSelected}
      onDeSelect={handleCustomForecastIndicatorDeleteFromMetadata}
      onSelect={handleCustomForecastIndicatorAddToMetadata}
      hoverRender={hoverRender}
    >
      <ExpandableListItem.Title>
        <div className="py-1 pl-4">{item.name}</div>
      </ExpandableListItem.Title>
      <ExpandableListItem.ExpandedContent>
        <div className="mt-2 space-y-2">
          {sourceIndicatorList
            ? sourceIndicatorList.map((sourceIndicator) => (
                <div
                  key={sourceIndicator.id}
                  className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-black">{`${sourceIndicator.ticker}(${sourceIndicator.name})`}</span>
                  <span className="text-sm text-black">{sourceIndicator.weight}%</span>
                </div>
              ))
            : null}
        </div>
      </ExpandableListItem.ExpandedContent>
    </ExpandableListItem>
  );
}

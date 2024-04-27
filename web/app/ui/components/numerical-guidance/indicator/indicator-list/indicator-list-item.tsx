import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectableItem from '../../../view/atom/selectable-item';
import ListItem from '../../../view/atom/list-item';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import IconButton from '../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';

type IndicatorListItemProps = {
  item: IndicatorInfoResponse;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU);
  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.indicatorIds?.some((id) => id === item.id) || false;
  const handleItemSelect = () => addIndicatorToMetadata({ indicatorId: item.id });
  const handleItemDeSelect = () => deleteIndicatorFromMetadata(item.id);

  const handleIconButton = () => {
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
    <div style={style}>
      <div className="flex h-full items-center justify-center">
        <ListItem hoverRender={hoverRender}>
          <SelectableItem
            onSelect={handleItemSelect}
            onDeSelect={handleItemDeSelect}
            key={item.id}
            selected={isSelected}
          >
            {item.name}
          </SelectableItem>
        </ListItem>
      </div>
    </div>
  );
}

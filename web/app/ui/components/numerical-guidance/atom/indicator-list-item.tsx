import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectableItem from '../../view/atom/selectable-item';
import { Indicator } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import ListItem from '../../view/atom/list-item';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import IconButton from '../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

type IndicatorListItemProps = {
  item: Indicator;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU);
  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.indicators?.some((i) => i.ticker === item.ticker) || false;
  const handleItemSelect = () => addIndicatorToMetadata(item);
  const handleItemDeSelect = () => deleteIndicatorFromMetadata(item.ticker);

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
    <ListItem style={style} hoverRender={hoverRender}>
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

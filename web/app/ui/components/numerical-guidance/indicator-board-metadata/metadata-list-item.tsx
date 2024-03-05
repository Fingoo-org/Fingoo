import SelectableItem from '../../view/atom/selectable-item';
import IconButton from '../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import ListItem from '../../view/atom/list-item';

type MetadataListItemProps = {
  item: IndicatorBoardMetadata;
};

export default function MetadataListItem({ item }: MetadataListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_EDIT_MENU);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleSelect = () => {
    selectMetadataById(item.id);
  };

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
    <ListItem hoverRender={hoverRender}>
      <SelectableItem key={item.id} selected={selectedMetadata?.id === item.id} onSelect={handleSelect}>
        {item.name}
      </SelectableItem>
    </ListItem>
  );
}

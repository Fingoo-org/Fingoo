import SelectableListItem from '../../view/atom/selectable-list-item';
import IconButton from '../../view/atom/icon-button/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../view/molocule/dialog-menu';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';

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

  return (
    <div className="group relative h-16 w-full">
      <SelectableListItem key={item.id} selected={selectedMetadata?.id === item.id} onSelect={handleSelect}>
        {item.name}
      </SelectableListItem>
      <div className="z-index-1 invisible absolute right-3 top-2/4  -translate-y-2/4 group-has-[:hover]:visible">
        <IconButton
          aria-label="edit"
          ref={iconButtonRef}
          onClick={handleIconButton}
          icon={DotsHorizontalIcon}
          color={'violet'}
        />
      </div>
    </div>
  );
}

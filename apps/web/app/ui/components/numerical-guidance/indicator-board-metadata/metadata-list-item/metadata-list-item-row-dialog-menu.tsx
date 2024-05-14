'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import DialogMenu from '../../../view/molecule/dialog-menu';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { TrashIcon } from '@heroicons/react/solid';

type Row = {
  indicatorId: string;
  metadataId?: string;
};

export default function MetadataListItemRowDialogMenu() {
  const { payload } = useDialog(DIALOG_KEY.METADATA_ROW_EDIT_MENU);
  // const  = useIndicatorBoardMetadataViewModel(metadataId)
  const { deleteIndicatorFromMetadata } = useIndicatorBoardMetadataViewModel((payload as Row)?.metadataId);

  const handleMetadataItemRowDelete = () => {
    deleteIndicatorFromMetadata((payload as Row)?.indicatorId);
  };

  return (
    <DialogMenu color={'gray'} size={'sm'} dialogKey={DIALOG_KEY.METADATA_ROW_EDIT_MENU}>
      <DialogMenu.Item aria-label="Delete metadata item row" onClick={handleMetadataItemRowDelete} icon={TrashIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}

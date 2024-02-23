'use client';
import DialogMenu from '../../../view/molocule/dialog-menu';
import { TrashIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useAlertDialog } from '../../../view/molocule/alert-dialog/use-alert-dialog.hook';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { useIndicatorBoardMetadata } from '@/app/business/hooks/use-indicator-board-metadata.hook';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';

export default function MetadataDialogMenu() {
  const { payload, openDialogWithPayload } = useAlertDialog(DIALOG_KEY.METADATA_DELETE);
  const { metadata, updateMetadata } = useIndicatorBoardMetadata(
    typeof payload !== 'undefined' ? (payload as IndicatorBoardMetadata).id : undefined,
  );

  const handleMetadataUpdate = (name: string) => {
    updateMetadata({ name });
  };

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput
          defaultValue={metadata !== undefined ? metadata.name : ''}
          withResetButton={true}
          withDebounce={500}
          onValueChange={handleMetadataUpdate}
        />
      </DialogMenu.Header>
      <DialogMenu.Item role={'menuitem'} aria-label="Delete" onClick={openDialogWithPayload} icon={TrashIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}

'use client';
import DialogMenu from '../../../view/molocule/dialog-menu';
import { TrashIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';

export default function MetadataDialogMenu() {
  const { payload, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_DELETE);
  const { indicatorBoardMetadata, updateIndicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(
    typeof payload !== 'undefined' ? (payload as IndicatorBoardMetadata).id : undefined,
  );

  const handleMetadataUpdate = (name: string) => {
    updateIndicatorBoardMetadata({ name });
  };

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput
          defaultValue={indicatorBoardMetadata !== undefined ? indicatorBoardMetadata.name : ''}
          withResetButton={true}
          withDebounce={500}
          onValueChange={handleMetadataUpdate}
        />
      </DialogMenu.Header>
      <DialogMenu.Item aria-label="Delete" onClick={openDialogWithPayload} icon={TrashIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}

'use client';
import DialogMenu from '../../../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useAlertDialog } from '../../../view/molocule/alert-dialog/use-alert-dialog.hook';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export default function MetadataDialogMenu() {
  const { payload, openDialogWithPayload } = useAlertDialog(DIALOG_KEY.METADATA_DELETE);

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput value={typeof payload !== 'undefined' ? (payload as IndicatorBoardMetadataResponse).name : ''} />
      </DialogMenu.Header>
      <DialogMenu.Item role={'menuitem'} aria-label="Delete" onClick={openDialogWithPayload} icon={DotsHorizontalIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}

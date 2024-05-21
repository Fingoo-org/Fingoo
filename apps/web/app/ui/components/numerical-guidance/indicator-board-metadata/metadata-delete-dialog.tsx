'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import AlertDialog from '../../view/molecule/alert-dialog';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';

export default function MetadataDeleteDialog() {
  const { deleteIndicatorBoardMetadata } = useIndicatorBoardMetadataList();
  const handleClick = (payload: unknown) => {
    deleteIndicatorBoardMetadata((payload as IndicatorBoardMetadata).id);
  };

  return (
    <AlertDialog dialogKey={DIALOG_KEY.METADATA_DELETE}>
      <AlertDialog.Title>Delete Metadata</AlertDialog.Title>
      <AlertDialog.Body>Are you sure you want to delete this metadata?</AlertDialog.Body>
      <AlertDialog.NegativeButton>Cancel</AlertDialog.NegativeButton>
      <AlertDialog.PositiveButton onClick={handleClick} color={'red'}>
        Delete
      </AlertDialog.PositiveButton>
    </AlertDialog>
  );
}

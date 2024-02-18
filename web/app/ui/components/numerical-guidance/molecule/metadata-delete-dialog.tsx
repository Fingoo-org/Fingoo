'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import AlertDialog from '../../view/molocule/alert-dialog';
import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/use-indicator-board-metadata-list.hook';

export default function MetadataDeleteDialog() {
  const { deleteMetadata } = useIndicatorBoardMetadataList();
  const handleClick = (payload: unknown) => {
    deleteMetadata((payload as IndicatorBoardMetadataResponse).id);
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

'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import AlertDialog from '../../../view/molecule/alert-dialog';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';

export default function MetadataDeleteDialog() {
  const { deleteIndicatorBoardMetadata } = useIndicatorBoardMetadataList();
  const handleClick = (payload: unknown) => {
    deleteIndicatorBoardMetadata((payload as IndicatorBoardMetadata).id);
  };

  return (
    <AlertDialog dialogKey={DIALOG_KEY.METADATA_DELETE}>
      <AlertDialog.Title>메타데이터 삭제</AlertDialog.Title>
      <AlertDialog.Body>메타데이터를 삭제하시겠습니까?</AlertDialog.Body>
      <AlertDialog.NegativeButton>Cancel</AlertDialog.NegativeButton>
      <AlertDialog.PositiveButton variant={'destructive'} onClick={handleClick}>
        Delete
      </AlertDialog.PositiveButton>
    </AlertDialog>
  );
}

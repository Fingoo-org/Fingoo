import IndicatorDialogMenu from '../../components/numerical-guidance/molecule/indicator-dialog-menu';
import MetadataDeleteDialog from '../../components/numerical-guidance/indicator-board-metadata/metadata-delete-dialog';
import MetadataDialogMenu from '../../components/numerical-guidance/indicator-board-metadata/metadata-dialog-menu/metadata-dialog-menu';

export default function DialogContainer() {
  return (
    <>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
    </>
  );
}

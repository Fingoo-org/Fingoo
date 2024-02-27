import IndicatorDialogMenu from '../../components/numerical-guidance/molecule/indicator-dialog-menu';
import MetadataDeleteDialog from '../../components/numerical-guidance/molecule/metadata-delete-dialog';
import MetadataDialogMenu from '../../components/numerical-guidance/molecule/metadata-dialog-menu/metadata-dialog-menu';

export default function DialogContainer() {
  return (
    <>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
    </>
  );
}

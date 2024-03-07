import IndicatorDialogMenu from '../../components/numerical-guidance/indicator/indicator-dialog-menu';
import MetadataDeleteDialog from '../../components/numerical-guidance/indicator-board-metadata/metadata-delete-dialog';
import MetadataDialogMenu from '../../components/numerical-guidance/indicator-board-metadata/metadata-dialog-menu/metadata-dialog-menu';
import Toaster from '../../components/view/molocule/toast/toaster';

export default function FloatingComponentContainer() {
  return (
    <>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
      <Toaster />
    </>
  );
}

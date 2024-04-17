import IndicatorDialogMenu from '../../components/numerical-guidance/indicator/indicator-dialog-menu';
import MetadataDeleteDialog from '../../components/numerical-guidance/indicator-board-metadata/metadata-delete-dialog';
import MetadataDialogMenu from '../../components/numerical-guidance/indicator-board-metadata/metadata-dialog-menu/metadata-dialog-menu';
import Toaster from '../../components/view/molecule/toast/toaster';
import CustomForecastIndicatorDialogMenu from '../../components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-dialog-menu/custom-forecast-indicator-dialog-menu';

export default function FloatingComponentContainer() {
  return (
    <>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
      <CustomForecastIndicatorDialogMenu />
      <Toaster />
    </>
  );
}

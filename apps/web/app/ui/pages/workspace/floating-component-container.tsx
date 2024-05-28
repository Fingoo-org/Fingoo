import IndicatorDialogMenu from '../../components/domain/numerical-guidance/indicator/indicator-dialog-menu';
import MetadataDeleteDialog from '../../components/domain/numerical-guidance/indicator-board-metadata/metadata-delete-dialog';
import MetadataDialogMenu from '../../components/domain/numerical-guidance/indicator-board-metadata/metadata-dialog-menu/metadata-dialog-menu';
import Toaster from '../../components/view/molecule/toast/toaster';
import CustomForecastIndicatorEditDialogMenu from '../../components/domain/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-edit-dialog-menu/custom-forecast-indicator-edit-dialog-menu';
import MetadataListItemRowDialogMenu from '../../components/domain/numerical-guidance/indicator-board-metadata/metadata-list-item/metadata-list-item-row-dialog-menu';

export default function FloatingComponentContainer() {
  return (
    <>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
      <CustomForecastIndicatorEditDialogMenu />
      <MetadataListItemRowDialogMenu />
      <Toaster />
    </>
  );
}

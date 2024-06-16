import { useDialog } from '@/app/utils/hooks/use-dialog.hook';
import CreateButton from '@/app/ui/components/view/molecule/create-button';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';

export default function CustomForecastIndicatorCreateButton() {
  const { dialogPositionRef, openDialogWithPayload } = useDialog(DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU);

  const handleCreateDialogOpen = () => {
    openDialogWithPayload();
  };

  return (
    <CreateButton
      ref={dialogPositionRef}
      onClick={handleCreateDialogOpen}
      label={'커스텀 예측 지표 추가'}
      isLoading={false}
    />
  );
}

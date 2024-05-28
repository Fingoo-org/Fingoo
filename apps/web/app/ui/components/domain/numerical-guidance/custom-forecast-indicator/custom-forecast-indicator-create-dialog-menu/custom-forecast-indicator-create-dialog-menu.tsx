'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';

export default function CustomForecastIndicatorCreateDialogMenu() {
  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <DialogMenu.Header>
        <div className="py-1 text-xs font-bold">1. 예측하고 싶은 지표를 선택하세요.</div>
      </DialogMenu.Header>
      <DialogMenu.Content></DialogMenu.Content>
    </DialogMenu>
  );
}

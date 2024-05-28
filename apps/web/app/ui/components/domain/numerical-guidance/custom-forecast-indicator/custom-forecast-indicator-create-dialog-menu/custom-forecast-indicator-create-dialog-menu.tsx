'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';

export default function CustomForecastIndicatorCreateDialogMenu() {
  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <DialogMenu.Header>
        <h2>Custom Forecast Indicator Create</h2>
      </DialogMenu.Header>
      <DialogMenu.Content>
        <p>Custom Forecast Indicator Create</p>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

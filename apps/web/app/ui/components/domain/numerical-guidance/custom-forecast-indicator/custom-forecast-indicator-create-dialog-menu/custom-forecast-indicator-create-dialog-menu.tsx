'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';
import SelectTargetIndicatorStepDialogMenu from './steps/select-target-indicator-step-dialog-menu';

export default function CustomForecastIndicatorCreateDialogMenu() {
  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <SelectTargetIndicatorStepDialogMenu />
    </DialogMenu>
  );
}

'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';
import SelectTargetIndicatorStepDialogMenu from './steps/select-target-indicator-step-dialog-menu';
import { useStepper } from '@/app/ui/components/view/hooks/use-stepper.hook';
import SelectSourceIndicatorStepDialogMenu from './steps/select-source-indicator-step-dialog-menu';

export default function CustomForecastIndicatorCreateDialogMenu() {
  const { Stepper, nextStep } = useStepper();

  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <Stepper>
        <Stepper.Step step={0}>
          <SelectTargetIndicatorStepDialogMenu nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Step step={1}>
          <SelectSourceIndicatorStepDialogMenu />
        </Stepper.Step>
      </Stepper>
    </DialogMenu>
  );
}

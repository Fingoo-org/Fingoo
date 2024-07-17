'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';
import SelectTargetIndicatorStepDialogMenu from './steps/select-target-indicator-step-dialog-menu';
import { useStepper } from '@/app/utils/hooks/use-stepper.hook';
import SelectSourceIndicatorStepDialogMenu from './steps/select-source-indicator-step-dialog-menu';

export default function CustomForecastIndicatorCreateDialogMenu() {
  const { Stepper, nextStep, prevStep } = useStepper();

  return (
    <DialogMenu color={'gray'} size={'3xl'} side={'right'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <Stepper>
        <Stepper.Step step={0}>
          <SelectTargetIndicatorStepDialogMenu nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Step step={1}>
          <SelectSourceIndicatorStepDialogMenu prevStep={prevStep} />
        </Stepper.Step>
      </Stepper>
    </DialogMenu>
  );
}

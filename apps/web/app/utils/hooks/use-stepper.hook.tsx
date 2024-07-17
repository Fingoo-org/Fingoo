import React, { useState } from 'react';
import { current } from 'tailwindcss/colors';

export const useStepper = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const Step = ({ children }: React.PropsWithChildren<{ step: number }>) => {
    return <>{children}</>;
  };

  const StepperRoot = ({ children }: React.PropsWithChildren) => {
    const targetStep = React.Children.toArray(children).find((childStep) => {
      return React.isValidElement(childStep) && childStep.props.step === step;
    });

    return <>{targetStep}</>;
  };

  const Stepper = Object.assign(StepperRoot, {
    Step,
  });

  return {
    currentStep: step,
    Stepper,
    nextStep,
    prevStep,
  };
};

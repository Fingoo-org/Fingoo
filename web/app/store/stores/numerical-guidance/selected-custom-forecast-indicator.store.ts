import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';

type SelectedCustomForecastIndicatorState = CustomForecastIndicatorResponse;

type SelectedCustomForecastIndicatorAction = {
  enroll: (customForecastIndicator: CustomForecastIndicatorResponse) => void;
};

type SelectedCustomForecastIndicatorStore = SelectedCustomForecastIndicatorState & {
  actions: SelectedCustomForecastIndicatorAction;
};

const initialSelectedCustomForecastIndicatorState: SelectedCustomForecastIndicatorState = {
  id: '',
  customForecastIndicatorName: '',
  targetIndicatorId: '',
  sourceIndicatorIdsAndWeights: [],
};

export const useSelectedCustomForecastIndicatorStore = create<SelectedCustomForecastIndicatorStore>((set) => {
  storeResetFns.add(() => set(initialSelectedCustomForecastIndicatorState));
  return {
    ...initialSelectedCustomForecastIndicatorState,
    actions: {
      enroll: (customForecastIndicator) => set(customForecastIndicator),
    },
  };
});

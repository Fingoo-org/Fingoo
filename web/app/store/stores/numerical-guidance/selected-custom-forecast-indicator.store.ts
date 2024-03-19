import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';

type CustomForecastIndicatorState = {
  selectedCustomForecastIndicator: CustomForecastIndicatorResponse;
};

type CustomForecastIndicatorAction = {
  enrollCustomForecastIndicator: (customForecastIndicator: CustomForecastIndicatorResponse) => void;
};

type CustomForecastIndicatorStore = CustomForecastIndicatorState & {
  actions: CustomForecastIndicatorAction;
};

const initialCustomForecastIndicatorState: CustomForecastIndicatorState = {
  selectedCustomForecastIndicator: {
    id: '',
    customForecastIndicatorName: '',
    targetIndicatorId: '',
    sourceIndicatorIdsAndWeights: [],
  },
};

export const useCustomForecastIndicatorStore = create<CustomForecastIndicatorStore>((set) => {
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      enrollCustomForecastIndicator: (customForecastIndicator) =>
        set({
          selectedCustomForecastIndicator: { ...customForecastIndicator },
        }),
    },
  };
});

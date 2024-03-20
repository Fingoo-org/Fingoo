import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';

type SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: CustomForecastIndicatorResponse;
};

type SelectedCustomForecastIndicatorAction = {
  enroll: (customForecastIndicator: CustomForecastIndicatorResponse) => void;
  addSourceIndicator: (indicatorId: string) => void;
  deleteSourceIndicator: (indicatorId: string) => void;
};

type SelectedCustomForecastIndicatorStore = SelectedCustomForecastIndicatorState & {
  actions: SelectedCustomForecastIndicatorAction;
};

const initialCustomForecastIndicatorState: SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: {
    id: '',
    customForecastIndicatorName: '',
    targetIndicatorId: '',
    sourceIndicatorIdsAndWeights: [],
  },
};

export const useSelectedCustomForecastIndicatorStore = create<SelectedCustomForecastIndicatorStore>((set) => {
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      enroll: (customForecastIndicator) =>
        set({
          selectedCustomForecastIndicator: { ...customForecastIndicator },
        }),
      addSourceIndicator: (indicatorId) => {
        set((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorIdsAndWeights: [
              ...state.selectedCustomForecastIndicator.sourceIndicatorIdsAndWeights,
              { sourceIndicatorId: indicatorId, weight: 0 },
            ],
          },
        }));
      },
      deleteSourceIndicator: (indicatorId) => {
        set((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorIdsAndWeights: state.selectedCustomForecastIndicator.sourceIndicatorIdsAndWeights.filter(
              (sourceIndicator) => sourceIndicator.sourceIndicatorId !== indicatorId,
            ),
          },
        }));
      },
    },
  };
});

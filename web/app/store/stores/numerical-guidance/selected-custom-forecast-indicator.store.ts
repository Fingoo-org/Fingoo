import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';

type SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: CustomForecastIndicatorResponse;
  isUpdated: boolean;
};

type SelectedCustomForecastIndicatorAction = {
  enroll: (customForecastIndicator: CustomForecastIndicatorResponse) => void;
  addSourceIndicator: (indicatorId: string) => void;
  deleteSourceIndicator: (indicatorId: string) => void;
  update: (
    fn: (
      state: SelectedCustomForecastIndicatorStore,
    ) => SelectedCustomForecastIndicatorStore | Partial<SelectedCustomForecastIndicatorStore>,
  ) => void;
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
  isUpdated: false,
};

export const useSelectedCustomForecastIndicatorStore = create<SelectedCustomForecastIndicatorStore>((set, get) => {
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      enroll: (customForecastIndicator) =>
        set({
          selectedCustomForecastIndicator: { ...customForecastIndicator },
        }),
      update: (fn) => {
        set((state) => {
          const newState = fn(state);
          return {
            ...newState,
            isUpdated: true,
          };
        });
      },
      addSourceIndicator: (indicatorId) => {
        get().actions.update((state) => ({
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
        get().actions.update((state) => ({
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

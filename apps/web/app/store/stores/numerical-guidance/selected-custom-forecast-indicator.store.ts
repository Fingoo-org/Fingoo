import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';
import { deepEqual } from '@/app/utils/helper';
import { IndicatorType } from './indicator-list.store';
import { IndicatorByTypeResponse } from '../../querys/numerical-guidance/indicator-list.query';

type SourceIndicatorOfCustomForecastIndicatorResponse = Pick<
  CustomForecastIndicatorResponse,
  'id' | 'sourceIndicatorsInformation' | 'sourceIndicators'
>;

type SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: SourceIndicatorOfCustomForecastIndicatorResponse;
  isUpdated: boolean;
};

type SelectedCustomForecastIndicatorAction = {
  enroll: (customForecastIndicator: SourceIndicatorOfCustomForecastIndicatorResponse) => void;
  update: (
    fn: (
      state: SelectedCustomForecastIndicatorStore,
    ) => SelectedCustomForecastIndicatorStore | Partial<SelectedCustomForecastIndicatorStore>,
  ) => void;
  addSourceIndicator: (indicatorByType: IndicatorByTypeResponse) => void;
  deleteSourceIndicator: (indicatorId: string) => void;
  updateSourceIndicatorWeight: (indicatorId: string, weight: number) => void;
  initialize: () => void;
};

type SelectedCustomForecastIndicatorStore = SelectedCustomForecastIndicatorState & {
  actions: SelectedCustomForecastIndicatorAction;
};

const initialCustomForecastIndicatorState: SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: {
    id: '',
    sourceIndicatorsInformation: [],
    sourceIndicators: [],
  },
  isUpdated: false,
};

export const useSelectedCustomForecastIndicatorStore = create<SelectedCustomForecastIndicatorStore>((set, get) => {
  let MemorizedCustomForecastIndicator: SourceIndicatorOfCustomForecastIndicatorResponse;
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      enroll: (customForecastIndicator) => {
        MemorizedCustomForecastIndicator = structuredClone(customForecastIndicator);
        set({
          selectedCustomForecastIndicator: { ...customForecastIndicator },
        });
      },
      initialize: () => {
        set((state) => {
          MemorizedCustomForecastIndicator = structuredClone(state.selectedCustomForecastIndicator);
          return {
            ...state,
            isUpdated: false,
          };
        });
      },
      update: (fn) => {
        set((state) => {
          const newState = fn(state);
          const isUpdated = deepEqual(MemorizedCustomForecastIndicator, newState.selectedCustomForecastIndicator)
            ? false
            : true;
          return {
            ...newState,
            isUpdated,
          };
        });
      },
      addSourceIndicator: (indicatorByType: IndicatorByTypeResponse) => {
        console.log(indicatorByType);
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorsInformation: [
              ...state.selectedCustomForecastIndicator.sourceIndicatorsInformation,
              { sourceIndicatorId: indicatorByType.id, weight: 0, indicatorType: indicatorByType.indicatorType },
            ],
            sourceIndicators: [...state.selectedCustomForecastIndicator.sourceIndicators, indicatorByType],
          },
        }));
      },
      deleteSourceIndicator: (indicatorId) => {
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorsInformation: state.selectedCustomForecastIndicator.sourceIndicatorsInformation.filter(
              (sourceIndicator) => sourceIndicator.sourceIndicatorId !== indicatorId,
            ),
          },
        }));
      },
      updateSourceIndicatorWeight(indicatorId, weight) {
        get().actions.update((state) => {
          const sourceIndicatorsInformation = state.selectedCustomForecastIndicator.sourceIndicatorsInformation.map(
            (sourceIndicator) => {
              if (sourceIndicator.sourceIndicatorId === indicatorId) {
                return { ...sourceIndicator, weight };
              }
              return sourceIndicator;
            },
          );
          return {
            ...state,
            selectedCustomForecastIndicator: {
              ...state.selectedCustomForecastIndicator,
              sourceIndicatorsInformation,
            },
          };
        });
      },
    },
  };
});

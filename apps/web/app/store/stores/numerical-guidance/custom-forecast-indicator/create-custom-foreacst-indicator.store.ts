import { create } from 'zustand';
import { storeResetFns } from '../../reset-store';
import { IndicatorType } from '../indicator-list.store';
import { sourceIndicator } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

type CreateCustomForecastIndicatorState = {
  targetIndicatorId?: string;
  targetIndicatorType?: IndicatorType;
  indicatorName: string;
  sourceIndicators: (sourceIndicator & {
    symbol: string;
  } )[];
};

type CreateCustomForecastIndicatorAction = {
  setState: (state: Partial<CreateCustomForecastIndicatorState>) => void;
  reset: () => void;
};

const initialCustomForecastIndicatorState: CreateCustomForecastIndicatorState = {
  targetIndicatorId: undefined,
  targetIndicatorType: undefined,
  indicatorName: '',
  sourceIndicators: [],
};

type CreateCustomForecastIndicatorStore = CreateCustomForecastIndicatorState & {
  actions: CreateCustomForecastIndicatorAction;
};

export const useCreateCustomForecastIndicatorStore = create<CreateCustomForecastIndicatorStore>((set, get) => {
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      setState: (state) => set(state),
      reset: () => set(initialCustomForecastIndicatorState),
    },
  };
});

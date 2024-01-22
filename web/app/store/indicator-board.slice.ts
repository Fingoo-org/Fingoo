import { StateCreator } from 'zustand';
import { sliceResetFns } from '.';
type Interval = 'day' | 'week' | 'month' | 'year';

type IndicatorBoardState = {
  id: string;
  selectedMetaDataID: string | null;
  interval: Interval;
};

type IndicatorBoardAction = {};

export type IndicatorBoardSlice = IndicatorBoardState & IndicatorBoardAction;

const initialIndicatorBoardState: IndicatorBoardState = {
  id: 'test',
  selectedMetaDataID: null,
  interval: 'day',
};

export const createIndicatorBoardSlice: StateCreator<IndicatorBoardSlice, [], [], IndicatorBoardSlice> = (set) => {
  sliceResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
  };
};

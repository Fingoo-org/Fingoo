import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

export const intervals = ['day', 'week', 'month', 'year'] as const;
export type Interval = (typeof intervals)[number];

type DetailBoardState = {
  interval: Interval;
};

type DetailBoardAction = {
  setInterval: (interval: Interval) => void;
};

type DetailBoardStore = DetailBoardState & {
  actions: DetailBoardAction;
};

const initialDetailBoardState: DetailBoardState = {
  interval: 'day',
};

export const useDetailBoardStore = create<DetailBoardStore>((set) => {
  storeResetFns.add(() => set(initialDetailBoardState));
  return {
    ...initialDetailBoardState,
    actions: {
      setInterval: (interval: Interval) => set({ interval }),
    },
  };
});

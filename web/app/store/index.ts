import { create } from 'zustand';
import { createIndicatorBoardSlice, IndicatorBoardSlice } from './indicator-board.slice';

export const sliceResetFns = new Set<() => void>();

export const resetAllSlice = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

type defaultState = {
  init: boolean;
};

export const useStore = create<defaultState & IndicatorBoardSlice>()((...a) => ({
  init: true,
  ...createIndicatorBoardSlice(...a),
}));

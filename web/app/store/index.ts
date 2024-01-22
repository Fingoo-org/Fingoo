import { create } from 'zustand';
import { createIndicatorBoardSlice, IndicatorBoardSlice } from './indicator-board.slice';
import { createIndicatorBoardMetadataSlice, IndicatorBoardMetadataSlice } from './indicator-board-metadata.slice';

export const sliceResetFns = new Set<() => void>();

export const resetAllSlice = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const useStore = create<IndicatorBoardSlice & IndicatorBoardMetadataSlice>()((...a) => ({
  init: true,
  ...createIndicatorBoardSlice(...a),
  ...createIndicatorBoardMetadataSlice(...a),
}));

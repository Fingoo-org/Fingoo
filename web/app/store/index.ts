import { create } from 'zustand';
import { createIndicatorBoardSlice, IndicatorBoardSlice } from './indicator-board.slice';
import { createIndicatorBoardMetadataSlice, IndicatorBoardMetadataSlice } from './indicator-board-metadata.slice';
import {
  createIndicatorBoardAndMetadataSlice,
  IndicatorBoardAndMetadataSlice,
} from './indicator-board-and-metadata.slice';

export const sliceResetFns = new Set<() => void>();

export const resetAllSlice = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

type defaultState = {
  init: boolean;
};

export const useStore = create<
  defaultState & IndicatorBoardSlice & IndicatorBoardMetadataSlice & IndicatorBoardAndMetadataSlice
>()((...a) => ({
  init: true,
  ...createIndicatorBoardSlice(...a),
  ...createIndicatorBoardMetadataSlice(...a),
  ...createIndicatorBoardAndMetadataSlice(...a),
}));

import { create } from 'zustand';

export const sliceResetFns = new Set<() => void>();

export const resetAllSlice = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};

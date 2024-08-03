import { create } from 'zustand';

interface ViewModeState {
  viewMode: boolean;
  setViewMode: (viewMode: boolean) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  viewMode: false,
  setViewMode: (viewMode) => set({ viewMode }),
}));

import { create } from 'zustand';

interface ViewModeState {
  sideNavbarCollapsed: boolean;
  chatbotSidebarCollapsed: boolean;
  setSideNavbarCollapsed: (collapsed: boolean) => void;
  setChatbotSidebarCollapsed: (collapsed: boolean) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  sideNavbarCollapsed: false,
  chatbotSidebarCollapsed: false,

  setSideNavbarCollapsed: (collapsed) => {
    set(() => ({
      sideNavbarCollapsed: collapsed,
    }));
  },

  setChatbotSidebarCollapsed: (collapsed) => {
    set(() => ({
      chatbotSidebarCollapsed: collapsed,
    }));
  },
}));

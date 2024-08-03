import { create } from 'zustand';

interface ViewModeState {
  viewMode: boolean;
  sideNavbarCollapsed: boolean;
  chatbotSidebarCollapsed: boolean;
  setSideNavbarCollapsed: (collapsed: boolean) => void;
  setChatbotSidebarCollapsed: (collapsed: boolean) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  viewMode: false,
  sideNavbarCollapsed: false,
  chatbotSidebarCollapsed: false,

  setSideNavbarCollapsed: (collapsed) => {
    set((state) => ({
      sideNavbarCollapsed: collapsed,
      viewMode: collapsed && state.chatbotSidebarCollapsed,
    }));
  },

  setChatbotSidebarCollapsed: (collapsed) => {
    set((state) => ({
      chatbotSidebarCollapsed: collapsed,
      viewMode: state.sideNavbarCollapsed && collapsed,
    }));
  },
}));

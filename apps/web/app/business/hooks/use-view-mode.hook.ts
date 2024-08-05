import { useViewModeStore } from '@/app/store/stores/viewmode.store';

export const useViewMode = () => {
  const { viewMode, setSideNavbarCollapsed, setChatbotSidebarCollapsed, sideNavbarCollapsed, chatbotSidebarCollapsed } =
    useViewModeStore();

  const enableViewMode = () => {
    setSideNavbarCollapsed(true);
    setChatbotSidebarCollapsed(true);
  };

  return {
    isViewMode: viewMode,
    setSideNavbarCollapsed,
    setChatbotSidebarCollapsed,
    enableViewMode,
    sideNavbarCollapsed,
    chatbotSidebarCollapsed,
  };
};

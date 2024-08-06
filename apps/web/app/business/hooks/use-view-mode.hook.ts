import { useViewModeStore } from '@/app/store/stores/viewmode.store';

export const useViewMode = () => {
  const { setSideNavbarCollapsed, setChatbotSidebarCollapsed, sideNavbarCollapsed, chatbotSidebarCollapsed } =
    useViewModeStore();

  const isViewMode = sideNavbarCollapsed && chatbotSidebarCollapsed;

  const enableViewMode = () => {
    setSideNavbarCollapsed(true);
    setChatbotSidebarCollapsed(true);
  };

  return {
    isViewMode,
    setSideNavbarCollapsed,
    setChatbotSidebarCollapsed,
    enableViewMode,
    sideNavbarCollapsed,
    chatbotSidebarCollapsed,
  };
};

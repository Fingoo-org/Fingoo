import { useViewModeStore } from '@/app/store/stores/viewmode.store';

export default function useViewModeActive() {
  const { setSideNavbarCollapsed, setChatbotSidebarCollapsed } = useViewModeStore();

  const useViewModeActiveHandler = () => {
    setSideNavbarCollapsed(true);
    setChatbotSidebarCollapsed(true);
    return '뷰모드 전환 완료';
  };

  return { useViewModeActiveHandler };
}

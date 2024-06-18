import { useMediaQuery } from 'react-responsive';

export function useResponsive() {
  const isBigScreen = useMediaQuery({ query: '(min-width: 1536px)' });
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1280px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 1024px)',
  });

  const isBigPhone = useMediaQuery({
    query: '(min-width: 768px)',
  });

  const isPhone = useMediaQuery({ query: '(min-width: 640px)' });

  return {
    isBigScreen,
    isDesktopOrLaptop,
    isTablet,
    isBigPhone,
    isPhone,
  };
}

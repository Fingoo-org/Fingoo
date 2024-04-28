import { useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator-list.query';

// deprecated
export const useIndicatorList = () => {
  const { data: indicatorList } = useFetchIndicatorList();

  return {
    indicatorList,
  };
};

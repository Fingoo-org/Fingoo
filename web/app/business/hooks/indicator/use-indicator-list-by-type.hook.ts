import { useFetchIndicatorListByType } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { useIndicatorListStore } from '@/app/store/stores/numerical-guidance/indicator-list.store';

export const useIndicatorListByType = () => {
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);
  const { data: indicatorList } = useFetchIndicatorListByType(selectedIndicatorType);

  return {
    indicatorList,
  };
};

import { useFetchIndicatorListByType } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { useIndicatorListStore } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { useMemo } from 'react';
import { convertIndicatorViewModel } from '../../services/view-model/indicator-list/indicator-view-model.service';

export const useIndicatorListByType = () => {
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);
  const { data: indicatorList, setSize } = useFetchIndicatorListByType(selectedIndicatorType);

  const convertedIndicatorList = useMemo(() => {
    if (!indicatorList) return undefined;

    return indicatorList
      .map((indicatorList) => {
        return convertIndicatorViewModel(indicatorList.data);
      })
      .flat();
  }, [indicatorList]);

  const loadMoreIndicators = () => {
    setSize((size) => size + 1);
  };

  return {
    indicatorList: convertedIndicatorList,
    loadMoreIndicators,
  };
};

import { useMemo } from 'react';
import { useFetchSearchedIndicatorList } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { IndicatorType, useIndicatorListStore } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { convertIndicatorViewModel } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';

type Options = {
  searchTerm?: string;
  indicatorType?: IndicatorType;
};

export const useSearchedIndicatorList = (options?: Options) => {
  const searchTerm = useIndicatorListStore((state) => state.searchTerm);
  const setSearchTerm = useIndicatorListStore((state) => state.actions.setSearchTerm);
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);

  const { data: indicatorList, isLoading } = useFetchSearchedIndicatorList(
    options?.searchTerm?.toLocaleUpperCase() ?? searchTerm.toLocaleUpperCase(),
    options?.indicatorType ?? selectedIndicatorType,
  );

  const convertedIndicatorList = useMemo(() => {
    if (!indicatorList) return undefined;

    return convertIndicatorViewModel(indicatorList);
  }, [indicatorList]);

  return {
    searchTerm,
    setSearchTerm,
    searchedIndicatorList: convertedIndicatorList,
    isLoading,
  };
};

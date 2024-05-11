import { useMemo, useState } from 'react';
import { useFetchSearchedIndicatorList } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { useIndicatorListStore } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { convertIndicatorViewModel } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';

export const useSearchedIndicatorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);

  const { data: indicatorList } = useFetchSearchedIndicatorList(searchTerm.toLocaleUpperCase(), selectedIndicatorType);

  const convertedIndicatorList = useMemo(() => {
    if (!indicatorList) return undefined;

    return convertIndicatorViewModel(indicatorList);
  }, [indicatorList]);

  return {
    searchTerm,
    setSearchTerm,
    searchedIndicatorList: convertedIndicatorList,
  };
};

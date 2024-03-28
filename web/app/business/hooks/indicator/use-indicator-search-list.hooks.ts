import { useMemo } from 'react';
import { IndicatorInfoResponse, useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';

export const useIndicatorSearchList = (searchTerm: string) => {
  const { data: indicatorList } = useFetchIndicatorList();
  const upperSearchTerm = searchTerm.toLocaleUpperCase();

  const indicatorIncludeSearch = (indicator: IndicatorInfoResponse) => {
    const isNameIncludes = indicator.name.toLocaleUpperCase().includes(upperSearchTerm);
    const isTickerIncludes = indicator.ticker.toLocaleUpperCase().includes(upperSearchTerm);

    return isNameIncludes || isTickerIncludes;
  };

  const filteredIndicatorList = useMemo(() => {
    if (!indicatorList) return undefined;
    if (searchTerm === '') return [];

    return indicatorList.filter((indicator) => indicatorIncludeSearch(indicator));
  }, [indicatorList, searchTerm]);

  return filteredIndicatorList;
};

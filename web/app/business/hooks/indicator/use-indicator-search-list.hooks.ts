import { useCallback, useMemo } from 'react';
import { IndicatorInfoResponse, useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';

export const useIndicatorSearchList = (searchTerm: string) => {
  const { data: indicatorList } = useFetchIndicatorList();
  const upperSearchTerm = searchTerm.toLocaleUpperCase();

  const isIndicatorInclude = useCallback(
    (indicator: IndicatorInfoResponse) => {
      const isNameIncludes = indicator.name.toLocaleUpperCase().includes(upperSearchTerm);
      const isTickerIncludes = indicator.ticker.toLocaleUpperCase().includes(upperSearchTerm);

      return isNameIncludes || isTickerIncludes;
    },
    [upperSearchTerm],
  );

  const filteredIndicatorList = useMemo(() => {
    if (!indicatorList) return undefined;
    if (searchTerm === '') return indicatorList;

    return indicatorList.filter((indicator) => isIndicatorInclude(indicator));
  }, [indicatorList, searchTerm, isIndicatorInclude]);

  return filteredIndicatorList;
};

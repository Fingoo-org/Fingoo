import { useMemo } from 'react';
import { useIndicatorList } from '../indicator/use-indicator-list.hook';

export const useIndicatorSearchList = (searchTerm: String) => {
  const { indicatorList } = useIndicatorList();

  const upperSearchTerm = searchTerm.toLocaleUpperCase();

  const indicatorNameIncludes = useMemo(() => {
    if (!indicatorList) return undefined;

    return indicatorList.filter((indicator) => indicator.name.toLocaleUpperCase().includes(upperSearchTerm));
  }, [indicatorList, upperSearchTerm]);

  const indicatorTickerIncludes = useMemo(() => {
    if (!indicatorList) return undefined;

    return indicatorList.filter((indicator) => indicator.ticker.toLocaleUpperCase().includes(upperSearchTerm));
  }, [indicatorList, upperSearchTerm]);

  const filteredIndicatorList = useMemo(() => {
    if (searchTerm === '') return indicatorList;
    if (indicatorNameIncludes === undefined || indicatorTickerIncludes === undefined) return undefined;
    return [...indicatorNameIncludes, ...indicatorTickerIncludes];
  }, [searchTerm, indicatorList, indicatorNameIncludes, indicatorTickerIncludes]);

  return filteredIndicatorList;
};

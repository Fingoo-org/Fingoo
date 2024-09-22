import {
  IndicatorQuoteRequest,
  useFetchIndicatorQuote,
} from '@/app/store/querys/numerical-guidance/indicator-quote.query';
import { useMemo } from 'react';

export const useIndicatorQuote = (request: IndicatorQuoteRequest) => {
  const {
    data: indicatorQuoteData,
    isValidating,
    mutate: revalidateIndicatorQuoteData,
  } = useFetchIndicatorQuote(request);

  const formattedIndicatorQuote = useMemo(() => {
    if (!indicatorQuoteData) {
      return undefined;
    }
    return indicatorQuoteData;
  }, [indicatorQuoteData]);

  return { formattedIndicatorQuote, isPending: isValidating, revalidateIndicatorQuoteData };
};

import { IndicatorQuoteRequest, useFetchIndicatorQuote } from '@/app/store/querys/mobile/indicator-quote.query';
import { useMemo } from 'react';

export const useIndicatorQuote = (request: IndicatorQuoteRequest) => {
  const {
    data: indicatorQuoteData,
    isValidating,
    mutate: revalidateIndicatorQuoteData,
  } = useFetchIndicatorQuote(request);

  const formattedIndicatorQuote = useMemo(() => {
    if (!indicatorQuoteData) {
      return {
        currency: 'USD',
        close: 0,
        change: 0,
        percentChange: '0%',
      };
    }

    return indicatorQuoteData;
  }, [indicatorQuoteData]);

  return { formattedIndicatorQuote, isPending: isValidating, revalidateIndicatorQuoteData };
};

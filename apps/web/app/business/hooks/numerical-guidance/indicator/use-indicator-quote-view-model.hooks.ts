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
      return {
        currency: 'USD',
        open: 0,
        close: 0,
        change: 0,
        percentChange: '0%',
        volume: 0,
        isMarketOpen: true,
        fiftyTwoWeek: {
          low: 0,
          high: 0,
        },
      };
    }

    return indicatorQuoteData;
  }, [indicatorQuoteData]);

  return { formattedIndicatorQuote, isPending: isValidating, revalidateIndicatorQuoteData };
};

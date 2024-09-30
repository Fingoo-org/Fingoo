import {
  IndicatorQuoteRequest,
  useFetchIndicatorQuote,
} from '@/app/store/querys/numerical-guidance/indicator-quote.query';
import { useMemo } from 'react';

const DEFAULT_REQUEST: Omit<IndicatorQuoteRequest, 'indicatorId' | 'symbol' | 'indicatorType'> = {
  volumeTimePeriod: '9',
  micCode: 'XNYS',
  eod: false,
  interval: '1day',
  timezone: 'Asia/Seoul',
};

export const useIndicatorQuote = ({ indicatorId, symbol, indicatorType, ...optionalParams }: IndicatorQuoteRequest) => {
  const request: IndicatorQuoteRequest = {
    indicatorId,
    symbol,
    indicatorType,
    ...DEFAULT_REQUEST,
    ...optionalParams,
  };

  const { data, isValidating, mutate } = useFetchIndicatorQuote(request);

  const formattedIndicatorQuote = useMemo(() => {
    if (!data) {
      return undefined;
    }
    return data;
  }, [data]);

  return {
    formattedIndicatorQuote,
    isPending: isValidating,
    revalidateIndicatorQuoteData: mutate,
  };
};

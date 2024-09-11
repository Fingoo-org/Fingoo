import { IndicatorQuoteResponse } from '@/app/store/querys/numerical-guidance/indicator-quote.query';
import { mockDatabaseStore } from '.';

export type MockIndicatorQuoteAction = {
  getIndicatorQuote: (symbol: string) => IndicatorQuoteResponse | undefined;
};

export const mockIndicatorQuoteAction: MockIndicatorQuoteAction = {
  getIndicatorQuote: (symbol) => {
    return mockDatabaseStore.indicatorQuoteResponse.find((indicator) => indicator.symbol === symbol);
  },
};

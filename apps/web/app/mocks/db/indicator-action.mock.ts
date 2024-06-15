import { HistoryIndicatorValueCursorPaginationResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import {
  IndicatorByTypeResponse,
  IndicatorListResponse,
} from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { mockDatabaseStore } from '.';

export type MockIndicatorAction = {
  getIndicators: () => IndicatorListResponse;
  getIndicator: (id: string) => IndicatorByTypeResponse | undefined;
  getIndicatorBySymbol: (symbol: string) => IndicatorByTypeResponse[];
  getIndicatorValue: (id: string) => IndicatorValueResponse | undefined;
  getHistoryIndicatorValue: (
    id: string,
    dataCount: number,
    endDate: string,
  ) => HistoryIndicatorValueCursorPaginationResponse | undefined;
};

export const mockIndicatorAction: MockIndicatorAction = {
  getIndicators: () => {
    return {
      data: mockDatabaseStore.indicators,
      meta: {
        total: mockDatabaseStore.indicators.length,
        hasNextData: false,
        cursor: 1,
      },
    };
  },
  getIndicatorBySymbol: (symbol) => {
    return mockDatabaseStore.indicators.filter((indicator) => indicator.symbol.indexOf(symbol) > -1);
  },
  getIndicator: (id) => {
    return mockDatabaseStore.indicators.find((indicator) => indicator.id === id);
  },
  getIndicatorValue: (id) => {
    return mockDatabaseStore.indicatorsValue.find((indicator) => indicator.indicatorId === id);
  },
  getHistoryIndicatorValue: (id, dataCount, endDate) => {
    const historyIndicatorValue = mockDatabaseStore.historyIndicatorsValue.find((indicator) => indicator.id === id);

    if (historyIndicatorValue === undefined) return undefined;

    const endDateIndex = historyIndicatorValue.data.values.findIndex((value) => value.date < endDate);

    const values = historyIndicatorValue.data.values.slice(endDateIndex, endDateIndex + dataCount);
    return {
      ...historyIndicatorValue,
      data: {
        ...historyIndicatorValue?.data,
        values,
      },
      meta: {
        total: values.length,
        hasNextData: historyIndicatorValue.data.values[endDateIndex + dataCount] ? true : false,
        cursor: historyIndicatorValue.data.values[endDateIndex + dataCount].date,
      },
    };
  },
};

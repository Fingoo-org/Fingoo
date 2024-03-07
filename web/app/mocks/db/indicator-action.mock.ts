import { HistoryIndicatorValueCursorPaginationResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { IndicatorListResponse, IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { mockDatabaseStore } from '.';

export type MockIndicatorAction = {
  getIndicatorList: () => IndicatorListResponse;
  getIndicatorValue: (id: string) => IndicatorValueResponse | undefined;
  getHistoryIndicatorValue: (
    id: string,
    startDate: string,
    endDate: string,
  ) => HistoryIndicatorValueCursorPaginationResponse | undefined;
};

export const mockIndicatorAction: MockIndicatorAction = {
  getIndicatorList: () => {
    return {
      indicatorList: mockDatabaseStore.indicatorList,
    };
  },
  getIndicatorValue: (id) => {
    return mockDatabaseStore.indicatorsValue.find((indicator) => indicator.id === id);
  },
  getHistoryIndicatorValue: (id, startDate, endDate) => {
    const historyIndicatorValue = mockDatabaseStore.historyIndicatorsValue.find((indicator) => indicator.id === id);

    if (historyIndicatorValue === undefined) return undefined;

    return {
      ...historyIndicatorValue,
      data: {
        ...historyIndicatorValue?.data,
        values: historyIndicatorValue?.data.values.filter((value) => value.date >= startDate && value.date <= endDate),
      },
    };
  },
};

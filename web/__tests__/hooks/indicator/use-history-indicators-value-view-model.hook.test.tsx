import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB, mockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

const wrapper = SWRProviderWithoutCache;

const findIndicatorByName = (indicatorName: string) => {
  return mockDB.getIndicatorList().indicatorList.find((indicator) => indicator.name === indicatorName);
};

describe('useHistoryIndicatorsValueViewModel', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('메타데이터를 선택했을 때, 지표를 선택하고 가져올 데이터 row를 설정하면, 선택한 지표의 history 값을 가져온다', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { historyIndicatorsValue, formattedHistoryIndicatorsRows, setPaginationData } =
          useHistoryIndicatorsValueViewModel();
        const { addIndicatorToMetadata, selectedMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
        return {
          historyIndicatorsValue,
          formattedHistoryIndicatorsRows,
          selectedMetadata,
          addIndicatorToMetadata,
          setPaginationData,
          selectMetadata,
        };
      },
      { wrapper },
    );
    act(() => {
      result.current.selectMetadata('1');
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // when
    const indicator = findIndicatorByName('삼성전자');
    act(() => {
      result.current.addIndicatorToMetadata({
        indicatorId: indicator?.id ?? '1',
      });
    });
    act(() => {
      result.current.setPaginationData({
        rowsToDownload: 10,
      });
    });

    await waitFor(() => expect(result.current.formattedHistoryIndicatorsRows).not.toHaveLength(0));

    // then
    expect(result.current.formattedHistoryIndicatorsRows).not.toHaveLength(0);
    expect(result.current.historyIndicatorsValue?.tickerList[0]).toBe('005930');
  });
});

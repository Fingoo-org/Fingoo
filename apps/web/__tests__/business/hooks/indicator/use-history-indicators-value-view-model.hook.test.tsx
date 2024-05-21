import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB, mockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-history-indicators-value-view-model.hook';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

const wrapper = SWRProviderWithoutCache;

const findIndicatorBySymbol = (symbol: string) => {
  return mockDB.getIndicators().data.find((indicator) => indicator.symbol === symbol);
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
        const { actualHistoryIndicatorsValue, setPaginationData } = useHistoryIndicatorsValueViewModel('1');
        const { addIndicatorToMetadata, selectedMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useWorkspaceStore((state) => state.actions.selectMetadata);
        return {
          actualHistoryIndicatorsValue,
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
    const indicator = findIndicatorBySymbol('005930');
    act(() => {
      result.current.addIndicatorToMetadata({
        id: indicator?.id ?? '',
        symbol: indicator?.symbol ?? '',
        name: '삼성전자' ?? '',
        exchange: 'KRX',
        indicatorType: 'stocks',
      });
    });
    act(() => {
      result.current.setPaginationData({
        rowsToDownload: 10,
      });
    });

    await waitFor(() => expect(result.current.actualHistoryIndicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.actualHistoryIndicatorsValue?.symbolList[0]).toBe('005930');
  });
});

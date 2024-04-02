import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB, mockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

const wrapper = SWRProviderWithoutCache;

const findIndicatorByName = (indicatorName: string) => {
  return mockDB.getIndicatorList().find((indicator) => indicator.name === indicatorName);
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
        const { actualHistoryIndicatorsValue, setPaginationData } = useHistoryIndicatorsValueViewModel();
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

    await waitFor(() => expect(result.current.actualHistoryIndicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.actualHistoryIndicatorsValue?.tickerList[0]).toBe('005930');
  });
});

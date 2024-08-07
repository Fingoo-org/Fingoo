import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB, mockDB } from '@/app/mocks/db';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { ActualIndicatorsValue } from '@/app/business/services/numerical-guidance/view-model/indicator-value/actual-indicators-value-view-model.service';

const wrapper = SWRProviderWithoutCache;

describe('useLiveIndicatorsValueViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터를 선택했을 때, 지표를 선택하면, 선택한 지표의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useLiveIndicatorsValueViewModel('1');
        const { selectedMetadata, addIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useWorkspaceStore((state) => state.actions.selectMetadata);
        return { indicatorsValue, selectedMetadata, addIndicatorToMetadata, selectMetadata };
      },
      { wrapper },
    );
    act(() => {
      result.current.selectMetadata('1');
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // // when
    act(() => {
      result.current.addIndicatorToMetadata({
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'US',
        indicatorType: 'stocks',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.indicatorsValue).toBeInstanceOf(ActualIndicatorsValue);
    expect(result.current.indicatorsValue?.length).toBe(1);
  });

  it('메타데이터를 선택했을 때, 지표를 여러개 선택하면, 선택한 지표들의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useLiveIndicatorsValueViewModel('1');
        const { selectedMetadata, addIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useWorkspaceStore((state) => state.actions.selectMetadata);
        return { indicatorsValue, selectedMetadata, addIndicatorToMetadata, selectMetadata };
      },
      { wrapper },
    );
    act(() => {
      result.current.selectMetadata('1');
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // // when
    act(() => {
      result.current.addIndicatorToMetadata({
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'US',
        indicatorType: 'stocks',
      });
    });
    act(() => {
      result.current.addIndicatorToMetadata({
        id: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        exchange: 'US',
        indicatorType: 'stocks',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.indicatorsValue).toBeInstanceOf(ActualIndicatorsValue);
    expect(result.current.indicatorsValue?.length).toBe(2);
  });

  it('메타데이터를 선택했을 때, 지표를 선택하고, 다시 선택한 지표를 삭제하면, 지표 값을 가져오지 않는다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useLiveIndicatorsValueViewModel('1');
        const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } =
          useSelectedIndicatorBoardMetadata();
        const selectMetadata = useWorkspaceStore((state) => state.actions.selectMetadata);
        return {
          indicatorsValue,
          selectedMetadata,
          addIndicatorToMetadata,
          deleteIndicatorFromMetadata,
          selectMetadata,
        };
      },
      { wrapper },
    );
    act(() => {
      result.current.selectMetadata('1');
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // // when
    act(() => {
      result.current.addIndicatorToMetadata({
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'US',
        indicatorType: 'stocks',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());
    act(() => {
      result.current.deleteIndicatorFromMetadata('1');
    });

    // then
    expect(result.current.indicatorsValue?.length).toBeUndefined();
  });
});

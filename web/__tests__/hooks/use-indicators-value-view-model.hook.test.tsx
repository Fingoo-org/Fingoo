import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB, mockDB } from '@/app/mocks/db';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { IndicatorsValue } from '@/app/business/services/view-model/indicators-value-view-model.service';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorsValueViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터를 선택했을 때, 지표를 선택하면, 선택한 지표의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useIndicatorsValueViewModel();
        const { selectedMetadata, addIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
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
        indicatorId: '1',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.indicatorsValue).toBeInstanceOf(IndicatorsValue);
    expect(result.current.indicatorsValue?.length).toBe(1);
  });

  it('메타데이터를 선택했을 때, 지표를 여러개 선택하면, 선택한 지표들의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useIndicatorsValueViewModel();
        const { selectedMetadata, addIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();
        const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
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
        indicatorId: '1',
      });
    });
    act(() => {
      result.current.addIndicatorToMetadata({
        indicatorId: '2',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());

    // then
    expect(result.current.indicatorsValue).toBeInstanceOf(IndicatorsValue);
    expect(result.current.indicatorsValue?.length).toBe(2);
  });

  it('메타데이터를 선택했을 때, 지표를 선택하고, 다시 선택한 지표를 삭제하면, 지표 값을 가져오지 않는다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        const { indicatorsValue } = useIndicatorsValueViewModel();
        const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } =
          useSelectedIndicatorBoardMetadata();
        const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
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
        indicatorId: '1',
      });
    });
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());
    act(() => {
      result.current.deleteIndicatorFromMetadata(mockDB.getIndicatorList().indicatorList[0].id);
    });

    // then
    expect(result.current.indicatorsValue?.length).toBe(0);
  });
});

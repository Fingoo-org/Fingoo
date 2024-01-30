import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/api/swr-provider';
import { resetMockDB } from '@/app/mocks/mock-db';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';
import { useSelectedIndicatorBoardMetadata } from '@/app/hooks/use-selected-indicator-board-metadata.hook';
import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';
import { useIndicatorList } from '@/app/hooks/use-indicator-list.hook';

const wrapper = SWRProviderWithoutCache;

describe('useSelectedIndicatorBoardMetadata', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터를 선택하면, 선택한 메타데이터 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());

    // when
    act(() => {
      if (metadataList.current.metadataList?.[0]) {
        store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
      }
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // then
    expect(result.current.selectedMetadata).toEqual(metadataList.current.metadataList?.[0]);
  });

  it('메타데이터를 선택하지 않으면, 선택한 메타데이터 값이 존재하지 않는다.', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());

    // when
    act(() => {
      store.current.actions.selectMetadata(null);
    });

    // then
    expect(result.current.selectedMetadata).toBeUndefined();
  });

  it('메타데이터를 선택했다가 해제하면, 선택한 메타데이터 값이 존재하지 않는다.', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());

    // when
    act(() => {
      if (metadataList.current.metadataList?.[0]) {
        store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
      }
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());
    act(() => {
      store.current.actions.selectMetadata(null);
    });
    await waitFor(() => expect(result.current.selectedMetadata).toBeUndefined());

    // then
    expect(result.current.selectedMetadata).toBeUndefined();
  });

  it('메타데이터를 선택했다가 다른 메타데이터를 선택하면, 마지막에 선택한 메타데이터 값을 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());

    // when
    act(() => {
      if (metadataList.current.metadataList?.[0]) {
        store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
      }
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());
    act(() => {
      if (metadataList.current.metadataList?.[1]) {
        store.current.actions.selectMetadata(metadataList.current.metadataList?.[1].id);
      }
    });
    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // then
    expect(result.current.selectedMetadata).toEqual(metadataList.current.metadataList?.[1]);
  });

  describe('addIndicatorToMetadata', () => {
    it('메타데이터를 선택했을 때, 선택한 메타데이터에 지표를 추가하면, 메타데이터 값에 선택한 지표가 추가된다.', async () => {
      // given
      const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
      const { result: indicatorList } = renderHook(() => useIndicatorList(), { wrapper });
      const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
      const { result: store } = renderHook(() => useNumericalGuidanceStore());
      await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());
      await waitFor(() => expect(indicatorList.current.indicatorList).not.toBeUndefined());
      act(() => {
        if (metadataList.current.metadataList?.[0]) {
          store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // when
      act(() => {
        if (indicatorList.current.indicatorList?.[0]) {
          result.current.addIndicatorToMetadata(indicatorList.current.indicatorList?.[0]);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // then
      expect(result.current.selectedMetadata?.indicators).toEqual([indicatorList.current.indicatorList?.[0]]);
    });
  });

  describe('deleteIndicatorFromMetadata', () => {
    it('메타데이터를 선택하고 선택한 메타데이터에 지표를 추가했을 때, 추가한 지표를 삭제하면, 메타데이터 값에 선택한 지표가 삭제된다.', async () => {
      // given
      const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
      const { result: indicatorList } = renderHook(() => useIndicatorList(), { wrapper });
      const { result: metadataList } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
      const { result: store } = renderHook(() => useNumericalGuidanceStore());
      await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());
      await waitFor(() => expect(indicatorList.current.indicatorList).not.toBeUndefined());
      act(() => {
        if (metadataList.current.metadataList?.[0]) {
          store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());
      act(() => {
        if (indicatorList.current.indicatorList?.[0]) {
          result.current.addIndicatorToMetadata(indicatorList.current.indicatorList?.[0]);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // when
      act(() => {
        if (indicatorList.current.indicatorList?.[0]) {
          result.current.deleteIndicatorFromMetadata(indicatorList.current.indicatorList?.[0].ticker);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // then
      expect(result.current.selectedMetadata?.indicators).toEqual([]);
    });
  });
});

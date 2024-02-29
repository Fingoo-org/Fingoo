import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';

const wrapper = SWRProviderWithoutCache;

// refactor: renderhook 사용법 변경해야함
describe('useSelectedIndicatorBoardMetadata', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터를 선택하면, 선택한 메타데이터 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
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
    const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());

    // when
    act(() => {
      store.current.actions.selectMetadata(undefined);
    });

    // then
    expect(result.current.selectedMetadata).toBeUndefined();
  });

  it('메타데이터를 선택했다가 해제하면, 선택한 메타데이터 값이 존재하지 않는다.', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
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
      store.current.actions.selectMetadata(undefined);
    });
    await waitFor(() => expect(result.current.selectedMetadata).toBeUndefined());

    // then
    expect(result.current.selectedMetadata).toBeUndefined();
  });

  it('메타데이터를 선택했다가 다른 메타데이터를 선택하면, 마지막에 선택한 메타데이터 값을 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
    const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
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
      const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
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
          result.current.addIndicatorToMetadata({
            indicatorId: '1',
          });
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // then
      expect(result.current.selectedMetadata?.indicatorIds[0]).toBe(indicatorList.current.indicatorList?.[0].id);
    });
  });

  describe('deleteIndicatorFromMetadata', () => {
    it('메타데이터를 선택하고 선택한 메타데이터에 지표를 추가했을 때, 추가한 지표를 삭제하면, 메타데이터 값에 선택한 지표가 삭제된다.', async () => {
      // given
      const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
      const { result: indicatorList } = renderHook(() => useIndicatorList(), { wrapper });
      const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
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
          result.current.addIndicatorToMetadata({
            indicatorId: '1',
          });
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // when
      act(() => {
        if (indicatorList.current.indicatorList?.[0]) {
          result.current.deleteIndicatorFromMetadata(indicatorList.current.indicatorList?.[0].id);
        }
      });
      await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

      // then
      expect(result.current.selectedMetadata?.indicatorIds).toEqual([]);
    });

    describe('updateMetadata', () => {
      it('메타데이터를 선택했을 때, 선택한 메타데이터의 이름을 변경하면, 메타데이터 값에 변경된 이름이 반영된다.', async () => {
        // given
        const { result } = renderHook(() => useSelectedIndicatorBoardMetadata(), { wrapper });
        const { result: metadataList } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
        const { result: store } = renderHook(() => useNumericalGuidanceStore());
        await waitFor(() => expect(metadataList.current.metadataList).not.toBeUndefined());
        act(() => {
          if (metadataList.current.metadataList?.[0]) {
            store.current.actions.selectMetadata(metadataList.current.metadataList?.[0].id);
          }
        });
        await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

        // when
        act(() => {
          result.current.updateMetadata({ name: 'changedName' });
        });
        await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

        // then
        expect(result.current.selectedMetadata?.name).toEqual('changedName');
      });
    });
  });
});

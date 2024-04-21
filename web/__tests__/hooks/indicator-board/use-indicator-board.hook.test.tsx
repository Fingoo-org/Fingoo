import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useIndicatorBoard } from '@/app/business/hooks/indicator-board/use-indicator-board.hook';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorBoard', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('지표를 지표 보드에 추가하지 않으면, 빈 지표보드 정보를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

    // when
    await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(0));
  });
  describe('addMetadataToIndicatorBoard', () => {
    it('지표를 지표 보드에 추가하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(1));
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('1'));
    });

    it('screen이 full일 때, 지표를 두번 추가하면, 마지막에 추가한 지표 정보만 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
        result.current.addMetadataToIndicatorBoard('2');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(1));
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('2'));
    });

    it('screen이 vertical일 때, 지표를 세번 추가하면, 세번 째 지표는 추가되지 않는다.', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('vertical');
      });
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
        result.current.addMetadataToIndicatorBoard('2');
      });
      act(() => {
        result.current.addMetadataToIndicatorBoard('3');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(2));
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('1'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[1].metadataId).toBe('2'));
    });

    it('screen이 square일 때, 지표를 다섯번 추가하면, 다섯번째 지표는 추가되지 않는다.', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('square');
      });
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
        result.current.addMetadataToIndicatorBoard('2');
        result.current.addMetadataToIndicatorBoard('3');
        result.current.addMetadataToIndicatorBoard('4');
      });
      act(() => {
        result.current.addMetadataToIndicatorBoard('5');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(4));
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('1'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[1].metadataId).toBe('2'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[2].metadataId).toBe('3'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[3].metadataId).toBe('4'));
    });
  });

  describe('deleteMetadataFromIndicatorBoard', () => {
    it('지표를 지표 보드에서 삭제하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
      });
      act(() => {
        result.current.deleteMetadataFromIndicatorBoard('1');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(0));
    });
  });

  describe('updateIndicatorBoardState', () => {
    it('지표 보드의 isAdvancedChart를 변경하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard('1'), { wrapper });

      // when
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
      });
      act(() => {
        result.current.setIsAdvancedChart(true);
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].isAdvancedChart).toBe(true));
    });
    it('지표 보드의 interval을 변경하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard('1'), { wrapper });

      // when
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
      });
      act(() => {
        result.current.setInterval('week');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].interval).toBe('week'));
    });
  });

  describe('transitionSplitScreen', () => {
    it('splitScreen을 변경하면, splitScreen 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('vertical');
      });

      // then
      await waitFor(() => expect(result.current.splitScreen).toBe('vertical'));
    });

    it('지표가 2개 추가되었을 때, splitScreen을 vertical에서 full로 변경하면, 지표 보드 정보를 1개만 남겨 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('vertical');
      });
      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
        result.current.addMetadataToIndicatorBoard('2');
      });
      act(() => {
        result.current.transitionSplitScreen('full');
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos).toHaveLength(1));
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('1'));
    });
  });

  describe('reorderIndicatorBoardInfos', () => {
    it('지표 보드의 순서를 변경하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('square');
      });

      act(() => {
        result.current.addMetadataToIndicatorBoard('1');
        result.current.addMetadataToIndicatorBoard('2');
        result.current.addMetadataToIndicatorBoard('3');
        result.current.addMetadataToIndicatorBoard('4');
      });
      act(() => {
        result.current.reorderIndicatorBoardInfos(['2', '1', '3', '4']);
      });

      // then
      await waitFor(() => expect(result.current.indicatorBoardInfos[0].metadataId).toBe('2'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[1].metadataId).toBe('1'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[2].metadataId).toBe('3'));
      await waitFor(() => expect(result.current.indicatorBoardInfos[3].metadataId).toBe('4'));
    });
  });
});

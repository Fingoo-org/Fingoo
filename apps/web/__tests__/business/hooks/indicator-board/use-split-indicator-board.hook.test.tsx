import { act, renderHook, waitFor } from '@testing-library/react';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';

const wrapper = SWRProviderWithoutCache;

describe('useSplitIndicatorBoard', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  describe('addMetadataToIndicatorBoard', () => {
    it('지표를 지표 보드에 추가하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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

  describe('reorderIndicatorBoardInfos', () => {
    it('지표 보드의 순서를 변경하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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

  describe('transitionSplitScreen', () => {
    it('splitScreen을 변경하면, splitScreen 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

      // when
      act(() => {
        result.current.transitionSplitScreen('vertical');
      });

      // then
      await waitFor(() => expect(result.current.splitScreen).toBe('vertical'));
    });

    it('지표가 2개 추가되었을 때, splitScreen을 vertical에서 full로 변경하면, 지표 보드 정보를 1개만 남겨 가져온다', async () => {
      // given
      const { result } = renderHook(() => useSplitIndicatorBoard(), { wrapper });

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
});

import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';

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

  describe('deleteMetadataFromIndicatorBoard', () => {
    it('지표를 지표 보드에서 삭제하면, 지표보드 정보를 가져온다', async () => {
      // given
      const { result } = renderHook(
        () => ({
          ...useIndicatorBoard(),
          ...useSplitIndicatorBoard(),
        }),
        { wrapper },
      );

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
      const { result } = renderHook(
        () => ({
          ...useIndicatorBoard('1'),
          ...useSplitIndicatorBoard(),
        }),
        { wrapper },
      );

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
      const { result } = renderHook(
        () => ({
          ...useIndicatorBoard('1'),
          ...useSplitIndicatorBoard(),
        }),
        { wrapper },
      );

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
});

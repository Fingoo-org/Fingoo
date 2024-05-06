import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorBoardMetadataViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('유효한 메타데이터 ID가 있을 때, 메타데이터를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataViewModel('1'), { wrapper });

    // when
    await waitFor(() => expect(result.current.indicatorBoardMetadata).not.toBeUndefined());

    // then
    expect(result.current.indicatorBoardMetadata?.id).toBe('1');
  });

  it('메타데이터 ID가 없을 때, 메타데이터를 가져오지 않는다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataViewModel(undefined), { wrapper });

    // when
    await waitFor(() => expect(result.current.indicatorBoardMetadata).toBeUndefined());

    // then
    expect(result.current.indicatorBoardMetadata).toBeUndefined();
  });

  it('유효한 메타데이터 ID가 있을때, 메타데이터를 수정하면, 메타데이터가 수정된다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataViewModel('1'), { wrapper });
    await waitFor(() => expect(result.current.indicatorBoardMetadata).toBeUndefined());

    // when
    act(() => {
      result.current.updateIndicatorBoardMetadata({ name: 'newName' });
    });

    // then
    expect(result.current.indicatorBoardMetadata?.name).toBe('newName');
  });

  it('유효하지 않은 메타데이터 ID가 제공되면, 메타데이터를 가져오지 않는다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataViewModel('invalid_id'), { wrapper });

    // when
    await waitFor(() => expect(result.current.indicatorBoardMetadata).toBeUndefined());

    // then
    expect(result.current.indicatorBoardMetadata).toBeUndefined();
  });

  describe('updateIndicatorIdsWithsectionIds', () => {
    it('메타데이터의 세션별 지표를 변경하면, 메타데이터 값에 변경된 세션별 지표가 반영된다.', async () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      await waitFor(() => expect(result.current.indicatorBoardMetadata).not.toBeUndefined());

      // when
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1'],
        });
      });
      await waitFor(() => expect(result.current.indicatorBoardMetadata).not.toBeUndefined());

      // then
      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds['section1'][0]).toBe('1');
    });
  });

  describe('addsectionToIndicatorBoardMetadata', () => {
    it('메타데이터에 세션을 추가하면, 세션이 추가된다', () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1', '2'],
        });
      });

      // when
      act(() => {
        result.current.addsectionToIndicatorBoardMetadata();
      });

      // then
      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds).toEqual({
        section1: ['1'],
        section2: ['2'],
      });
    });

    it('메타데이터에 세션을 여러번 추가혀면, 세션이 추가된다', () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1', '2'],
        });
      });

      act(() => {
        result.current.addsectionToIndicatorBoardMetadata();
      });
      act(() => {
        result.current.addsectionToIndicatorBoardMetadata();
      });

      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds).toEqual({
        section1: ['1'],
        section2: [],
        section3: ['2'],
      });
    });
  });

  describe('deleteSectionFromIndicatorBoardMetadata', () => {
    it('메타데이터에 세션을 삭제하면, 세션이 삭제된다', () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1'],
          section2: ['2'],
        });
      });

      // when
      act(() => {
        result.current.deleteSectionFromIndicatorBoardMetadata(1);
      });

      // then
      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds).toEqual({
        section1: ['1', '2'],
      });
    });

    it('메타데이터에 세션을 여러번 삭제하면, 세션이 삭제된다', () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1'],
          section2: ['2'],
          section3: ['3'],
        });
      });

      // when
      act(() => {
        result.current.deleteSectionFromIndicatorBoardMetadata(1);
      });
      act(() => {
        result.current.deleteSectionFromIndicatorBoardMetadata(1);
      });

      // then
      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds).toEqual({
        section1: ['1', '2', '3'],
      });
    });

    it('메타데이터의 섹션이 여러개 있을때, 중간에 있는 섹션을 삭제하면, 삭제한 섹션의 지표가 이전 섹션으로 이동한다.', () => {
      // given
      const { result } = renderHook(() => {
        return {
          ...useIndicatorBoardMetadataViewModel('1'),
        };
      });
      act(() => {
        result.current.updateIndicatorIdsWithsectionIds({
          section1: ['1'],
          section2: ['2'],
          section3: ['3'],
          section4: ['4'],
        });
      });

      // when
      act(() => {
        result.current.deleteSectionFromIndicatorBoardMetadata(2);
      });

      // then
      expect(result.current.indicatorBoardMetadata?.indicatorIdsWithSectionIds).toEqual({
        section1: ['1'],
        section2: ['2', '3'],
        section3: ['4'],
      });
    });
  });
});

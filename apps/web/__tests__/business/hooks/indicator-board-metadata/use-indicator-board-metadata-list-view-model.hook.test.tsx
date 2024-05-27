import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { act, renderHook, waitFor } from '@testing-library/react';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorBoardMetadataList', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    // then
    expect(result.current.metadataList).toHaveLength(3);
    expect(result.current.metadataList?.[0].id).toBe('1');
  });

  it('메타데이터를 생성하면, 생성한 메타데이터를 포함한 메타데이터 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    await act(() => {
      result.current.createIndicatorBoardMetadata();
    });

    // then
    await waitFor(() => expect(result.current.metadataList).toHaveLength(4));
  });

  it('메타데이터를 삭제하면, 삭제한 메타데이터를 포함하지 않는 메타데이터 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatorBoardMetadataList(), { wrapper });
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    await act(() => {
      result.current.deleteIndicatorBoardMetadata('1');
    });

    // then
    expect(result.current.metadataList).toHaveLength(2);
    expect(result.current.metadataList?.[0]).not.toEqual({ id: '1', name: 'metadata1', indicators: [] });
  });
});

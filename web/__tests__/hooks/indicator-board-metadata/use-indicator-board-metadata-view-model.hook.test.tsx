import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

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
});

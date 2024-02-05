import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/app/mocks/server.mock';
import { HttpResponse, http } from 'msw';
import { API_PATH } from '@/app/querys/api-path';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';
import { act } from 'react-dom/test-utils';
import { SWRProviderWithoutCache } from '@/app/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatoBoardrMetadataList', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    // then
    expect(result.current.metadataList).toEqual([
      {
        id: '1',
        name: 'metadata1',
        indicators: [],
      },
      {
        id: '2',
        name: 'metadata2',
        indicators: [],
      },
      {
        id: '3',
        name: 'metadata3',
        indicators: [],
      },
    ]);
  });

  it('메타데이터를 생성하면, 생성한 메타데이터를 포함한 메타데이터 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    await act(() => {
      result.current.createMetadata({ id: '4', name: 'metadata4', indicators: [] });
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // then
    expect(result.current.metadataList).toHaveLength(4);
    expect(result.current.metadataList?.[3]).toEqual({ id: '4', name: 'metadata4', indicators: [] });
  });

  // Risk: https://mswjs.io/docs/limitations#parallel-runs
  it('서버에 장애가 있을 때, 메타데이터를 생성하면, 생성한 메타데이터를 포함하지 않는 메타데이터 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    server.use(
      http.post(API_PATH.metadataList, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await waitFor(() => expect(result.current.metadataList).not.toBeUndefined());

    // when
    await act(() => {
      result.current.createMetadata({ id: '4', name: 'metadata4', indicators: [] });
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // then
    expect(result.current.metadataList).toHaveLength(3);
    expect(result.current.metadataList?.[3]).not.toEqual({ id: '4', name: 'metadata4', indicators: [] });
    expect(store.current.selectedMetadataId).toBe(null);
  });
});

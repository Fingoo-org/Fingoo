import { useIndicatorMetadataList } from '@/app/hooks/use-indicator-metadata-list.hook';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/app/mocks/server';
import { HttpResponse, http } from 'msw';
import { API_PATH } from '@/app/api/api-path';
import { SWRConfig } from 'swr';
import { PropsWithChildren } from 'react';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';
import { act } from 'react-dom/test-utils';

const wrapper = ({ children }: PropsWithChildren) => {
  return <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>;
};

describe('useIndicatorMetadataList', () => {
  beforeEach(() => {
    resetAllStore();
  });
  it('메타 데이터 가져오기', async () => {
    // given
    const { result } = renderHook(() => useIndicatorMetadataList());

    // when
    await waitFor(() => expect(result.current.isLoading).toBe(false));

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

  it('메타 데이터 추가하기', async () => {
    // given
    const { result } = renderHook(() => useIndicatorMetadataList());

    // when
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => result.current.createAndSelectMetadata({ id: '4', name: 'metadata4', indicators: [] }));

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
      {
        id: '4',
        name: 'metadata4',
        indicators: [],
      },
    ]);
  });

  // Risk: https://mswjs.io/docs/limitations#parallel-runs
  it('메타 데이터 추가하기 실패', async () => {
    // given
    const { result } = renderHook(() => useIndicatorMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    server.use(
      http.post(API_PATH.metadataList, () => {
        return new HttpResponse(null, { status: 400 });
      }),
    );

    // when
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => result.current.createAndSelectMetadata({ id: '4', name: 'metadata4', indicators: [] }));

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
    expect(store.current.selectedMetadataId).toBe(null);
  });

  it('메타데이터 추가하기 실패: 낙관적 업데이트 테스트', async () => {
    // given
    const { result } = renderHook(() => useIndicatorMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    server.use(
      http.post(API_PATH.metadataList, () => {
        return new HttpResponse(null, { status: 400 });
      }),
    );

    // when
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => {
      result.current.createAndSelectMetadata({ id: '4', name: 'metadata4', indicators: [] });
    });
    // 낙관적 업데이트 시 바로 업데이트 되기 때문에, 서버에서 실패하더라도 바로 업데이트 된다.
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
      {
        id: '4',
        name: 'metadata4',
        indicators: [],
      },
    ]);
    expect(store.current.selectedMetadataId).toBe('4');
    await waitFor(() => expect(result.current.mutationError).not.toBe(undefined));

    // then
    // 이후 rollback 되기 때문에, 업데이트가 되지 않는다.
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
    expect(store.current.selectedMetadataId).toBe(null);
  });
});

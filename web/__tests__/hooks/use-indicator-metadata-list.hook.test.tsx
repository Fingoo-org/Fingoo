import { useIndicatorMetadataList } from '@/app/hooks/use-indicator-metadata-list.hook';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/app/mock/server';
import { HttpResponse, http } from 'msw';
import { API_PATH } from '@/app/api/constants/api-path';
import { SWRConfig } from 'swr';
import { PropsWithChildren } from 'react';

const wrapper = ({ children }: PropsWithChildren) => {
  return <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>;
};

describe('useIndicatorMetadataList', () => {
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
    server.use(
      http.post(API_PATH.metadataList, () => {
        return new HttpResponse(null, { status: 400 });
      }),
    );

    // when
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => result.current.createAndSelectMetadata({ id: '4', name: 'metadata4', indicators: [] }));
    await waitFor(() => expect(result.current.mutationError).not.toBe(undefined));

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
});

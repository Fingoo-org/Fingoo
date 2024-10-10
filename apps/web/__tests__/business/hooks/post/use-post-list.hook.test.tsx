import { renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { usePostList } from '@/app/business/hooks/post/use-post-list.hook';
import { mockDatabaseStore, resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';

const wrapper = SWRProviderWithoutCache;

describe('usePostList', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
    console.log('Current mockDB:', mockDatabaseStore); // Mock 데이터 상태를 확인
  });

  it('게시물 리스트를 가져온다.', async () => {
    const { result } = renderHook(() => usePostList(), { wrapper });

    await waitFor(() => expect(result.current.postList).not.toBeUndefined());

    expect(result.current.postList?.length).toBeGreaterThan(0);
    expect(result.current.postList?.[0].author.userName).toBe('John Doe');
  });
});

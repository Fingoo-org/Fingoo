import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';

const wrapper = SWRProviderWithoutCache;

describe('useSearchedIndicatorList', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('검색어를 입력하지 않으면, 지표 리스트를 가져오지 않는다', async () => {
    // given
    const { result } = renderHook(() => useSearchedIndicatorList(), { wrapper });
    await waitFor(() => expect(result.current.searchedIndicatorList).toBeUndefined());
  });

  it('검색어를 2자리 이상 입력하지 않으면, 지표 리스트를 가져오지 않는다', async () => {
    // given
    const { result } = renderHook(() => useSearchedIndicatorList({ searchTerm: 'a' }), { wrapper });
    await waitFor(() => expect(result.current.searchedIndicatorList).toBeUndefined());
  });

  it('검색어를 입력하면, 해당하는 지표 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSearchedIndicatorList({ searchTerm: 'AAPL' }), { wrapper });
    await waitFor(() => expect(result.current.searchedIndicatorList).not.toBeUndefined());

    expect(result.current.searchedIndicatorList?.[0].symbol).toBe('AAPL');
  });

  it('검색어를 부분 입력하여도, 해당하는 지표 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSearchedIndicatorList({ searchTerm: 'AP' }), { wrapper });
    await waitFor(() => expect(result.current.searchedIndicatorList).not.toBeUndefined());

    expect(result.current.searchedIndicatorList?.[0].symbol).toBe('AAPL');
  });
});

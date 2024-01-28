import { renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/api/swr-provider';
import { useIndicatorList } from '@/app/hooks/use-indicator-list.hook';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorList', () => {
  it('지표 리스트 가져오기', async () => {
    // given
    const { result } = renderHook(() => useIndicatorList(), { wrapper });

    // when
    await waitFor(() => expect(result.current.indicatorList).not.toBeUndefined());

    // then
    expect(result.current.indicatorList).toHaveLength(3);
    expect(result.current.indicatorList?.[0].ticker).toBe('AAPL');
    expect(result.current.indicatorList?.[1].ticker).toBe('MSFT');
    expect(result.current.indicatorList?.[2].ticker).toBe('GOOG');
  });
});

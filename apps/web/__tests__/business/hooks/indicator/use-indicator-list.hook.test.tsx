import { renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { useIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list.hook';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorList', () => {
  it('지표 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatorList(), { wrapper });
    await waitFor(() => expect(result.current.indicatorList).not.toBeUndefined());

    // when
    // then
    expect(result.current.indicatorList).toHaveLength(4);
    expect(result.current.indicatorList?.[0].ticker).toBe('AAPL');
    expect(result.current.indicatorList?.[1].ticker).toBe('MSFT');
    expect(result.current.indicatorList?.[2].ticker).toBe('GOOG');
    expect(result.current.indicatorList?.[3].ticker).toBe('005930');
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { useIndicatorListByType } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list-by-type.hook';

const wrapper = SWRProviderWithoutCache;

describe('useIndicatorListByType', () => {
  it('지표 리스트를 가져온다.', async () => {
    // given
    const { result } = renderHook(() => useIndicatorListByType(), { wrapper });
    await waitFor(() => expect(result.current.indicatorList).not.toBeUndefined());

    // when
    // then
    expect(result.current.indicatorList).toHaveLength(4);
    expect(result.current.indicatorList?.[0].symbol).toBe('AAPL');
    expect(result.current.indicatorList?.[1].symbol).toBe('MSFT');
    expect(result.current.indicatorList?.[2].symbol).toBe('GOOG');
    expect(result.current.indicatorList?.[3].symbol).toBe('005930');
  });
});

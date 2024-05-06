import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useSourceIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-source-indicator.hook';

const wrapper = SWRProviderWithoutCache;

describe('useSourceIndicator', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('커스텀 예측 지표를 선택했을 때, 소스 지표 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSourceIndicator('12'), { wrapper });

    // when
    await waitFor(() => expect(result.current.sourceIndicatorList).toHaveLength(2));
    await waitFor(() => expect(result.current.sourceIndicatorList?.[0].id).toBe('1'));
    await waitFor(() => expect(result.current.sourceIndicatorList?.[1].id).toBe('3'));
  });
});

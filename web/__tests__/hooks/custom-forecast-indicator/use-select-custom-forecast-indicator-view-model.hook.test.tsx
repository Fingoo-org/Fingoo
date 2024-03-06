import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';

const wrapper = SWRProviderWithoutCache;

describe('useSelectedCustomForecastIndicatorViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('예측 지표를 선택하면, 선택한 예측 지표를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSelectedCustomForecastIndicatorViewModel(), { wrapper });

    // when
    act(() => {
      result.current.selectCustomForecastIndicator('2');
    });
    await waitFor(() => expect(result.current.selectedCustomForecastIndicator).not.toBeUndefined());

    // then
    expect(result.current.selectedCustomForecastIndicator?.id).toBe('2');
  });

  it('예측 지표를 선택하지 않으면, 선택한 예측 지표를 가져오지 않는다', async () => {
    // given
    const { result } = renderHook(() => useSelectedCustomForecastIndicatorViewModel(), { wrapper });

    // when
    await waitFor(() => expect(result.current.selectedCustomForecastIndicator).toBeUndefined());

    // then
    expect(result.current.selectedCustomForecastIndicator).toBeUndefined();
  });

  it('예측 지표를 선택하면 선택한 예측 지표의 소스 지표 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useSelectedCustomForecastIndicatorViewModel(), { wrapper });

    // when
    act(() => {
      result.current.selectCustomForecastIndicator('2');
    });
    await waitFor(() => expect(result.current.sourceIndicatorList).not.toBeUndefined());

    // then
    expect(result.current.sourceIndicatorList).toHaveLength(2);
    expect(result.current.sourceIndicatorList?.[0].ticker).toBe('AAPL');
  });
});

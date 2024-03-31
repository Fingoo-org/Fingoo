import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';

const wrapper = SWRProviderWithoutCache;

describe('useCustomForecastIndicatorListViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('예측 지표 리스트를 가져온다', async () => {
    // given
    const { result } = renderHook(() => useCustomForecastIndicatorListViewModel(), { wrapper });

    // when
    await waitFor(() => expect(result.current.customForecastIndicatorList).not.toBeUndefined());

    // then
    expect(result.current.customForecastIndicatorList).toHaveLength(4);
  });

  it('예측 지표를 추가하면, 예측 지표 리스트에 추가된다', async () => {
    // given
    const { result } = renderHook(() => useCustomForecastIndicatorListViewModel(), { wrapper });
    await waitFor(() => expect(result.current.customForecastIndicatorList).not.toBeUndefined());

    // when
    act(() => {
      result.current.createCustomForecastIndicator({ targetIndicatorId: '1' });
    });

    // then
    await waitFor(() => expect(result.current.customForecastIndicatorList).toHaveLength(5));
    expect(result.current.customForecastIndicatorList?.findCustomForecastIndicatorByIndex(4).targetIndicatorId).toBe(
      '1',
    );
  });

  it('예측 지표를 삭제하면, 예측 지표 리스트에서 삭제된다', async () => {
    // given
    const { result } = renderHook(() => useCustomForecastIndicatorListViewModel(), { wrapper });
    await waitFor(() => expect(result.current.customForecastIndicatorList).not.toBeUndefined());

    // when
    act(() => {
      result.current.deleteCustomForecastIndicator('11');
    });

    // then
    await waitFor(() => expect(result.current.customForecastIndicatorList).toHaveLength(3));
    expect(result.current.customForecastIndicatorList?.findCustomForecastIndicatorByIndex(0).id).toBe('12');
  });
});

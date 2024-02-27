import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import CustomForecastIndicatorList from '@/app/ui/components/numerical-guidance/molecule/custom-forecast-indicator-list';

describe('CustomForecastIndicatorList', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터가 선택되었을 때, 커스텀 예측 지표 리스트를 보여준다', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    store.current.actions.selectMetadata('1');
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    // then
    expect(await screen.findByText(/customForecastIndicator1/i)).toBeVisible();
    expect(await screen.findByText(/customForecastIndicator2/i)).toBeVisible();
    expect(await screen.findByText(/customForecastIndicator3/i)).toBeVisible();
  });
});

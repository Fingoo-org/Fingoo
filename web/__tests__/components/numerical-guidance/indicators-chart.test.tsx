import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import IndicatorsChart from '@/app/ui/components/numerical-guidance/indicators-chart';
import IndicatorList from '@/app/ui/components/numerical-guidance/indicator-list';

// chart 테스트 목적으로 전역 `ResizeObserver` 클래스를 모킹
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('IndicatorsChart', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('선택한 메타데이터가 없을 때, 데이터가 없다는 메시지를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <IndicatorsChart />
      </SWRProviderWithoutCache>,
    );

    // when
    // then
    expect(await screen.findByText(/No data/i)).toBeInTheDocument();
  });

  it('선택한 메타데이터가 있을 때, 지표를 선택하면, 차트를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <IndicatorsChart />
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await userEvent.click(await screen.findByText(/Apple Inc./i));

    // then
    expect(screen.queryByText(/No data/i)).toBeNull();
    expect(await screen.findByText(/APPL/i)).toBeInTheDocument();
  });

  it('선택한 메타데이터가 있을 때, 지표를 선택하고 다시 선택하면, 차트를 숨긴다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <IndicatorsChart />

        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await userEvent.click(await screen.findByText(/Apple Inc./i));
    await userEvent.click(await screen.findByText(/Apple Inc./i));

    // then
    expect(await screen.findByText(/No data/i)).toBeInTheDocument();
  });
});

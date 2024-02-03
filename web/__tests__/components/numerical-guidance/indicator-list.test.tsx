import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRProviderWithoutCache } from '@/app/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/mock-db';
import IndicatorList from '@/app/ui/components/numerical-guidance/indicator-list';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';

describe('IndicatorList', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('메타데이터가 선택되었을 때, 지표 리스트를 조회한다.', async () => {
    render(
      <SWRProviderWithoutCache>
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    // then
    expect(await screen.findByText(/Apple Inc./i)).toBeVisible();
    expect(await screen.findByText(/Microsoft Corporation/i)).toBeVisible();
    expect(await screen.findByText(/Alphabet Inc./i)).toBeVisible();
  });

  it('메타데이터가 선택되었을 때, 사용자가 지표를 클릭하여 선택하면, 지표가 선택되어진다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await user.click(await screen.findByText(/Apple Inc./i));

    // then
    expect(await screen.findByRole('tab', { selected: true })).toBeInTheDocument();
  });

  it('메타데이터가 선택되었을 때, 사용자가 지표를 클릭한 후 다시 클릭하면, 지표가 선택해제되어진다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await user.click(await screen.findByText(/Apple Inc./i));
    await user.click(await screen.findByText(/Apple Inc./i));

    // then
    expect(screen.queryByRole('tab', { selected: true })).not.toBeInTheDocument();
  });
});

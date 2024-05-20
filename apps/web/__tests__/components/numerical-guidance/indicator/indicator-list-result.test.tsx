import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import IndicatorListResult from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list-result';

describe('IndicatorListResult', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();

    // 메타데이터가 선택 되었음을 가정
    const { result: store } = renderHook(() => useWorkspaceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
  });

  it('지표 리스트를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <IndicatorListResult />
      </SWRProviderWithoutCache>,
    );
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    // then
    expect(await screen.findByText(/AAPL/i)).toBeVisible();
    expect(await screen.findByText(/MSFT/i)).toBeVisible();
    expect(await screen.findByText(/GOOG/i)).toBeVisible();
  });

  it('사용자가 지표를 클릭하여 선택하면, 지표가 선택되어진다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorListResult />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useWorkspaceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await user.click(await screen.findByText(/AAPL/i));

    // then
    expect(await screen.findByRole('tab', { selected: true })).toBeInTheDocument();
  });

  it('사용자가 지표를 클릭한 후 다시 클릭하면, 지표가 선택해제되어진다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorListResult />
      </SWRProviderWithoutCache>,
    );
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

    // when
    await user.click(await screen.findByText(/AAPL/i));
    await user.click(await screen.findByText(/AAPL/i));

    // then
    expect(screen.queryByRole('tab', { selected: true })).not.toBeInTheDocument();
  });
});

import { act, render, renderHook, screen } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import IndicatorList from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import userEvent from '@testing-library/user-event';
import IndicatorDialogMenu from '@/app/ui/components/numerical-guidance/indicator/indicator-dialog-menu';
import CustomForecastIndicatorList from '@/app/ui/components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-list/custom-forecast-indicator-list';

describe('IndicatorDialogMenu', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
    // 메타데이터가 선택 되었음을 가정
    const { result: store } = renderHook(() => useWorkspaceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
  });

  it('사용자가 지표 편집 버튼을 클릭하면, 편집할 수 있는 dialog menu룰 보여준다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorDialogMenu />
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    // when
    await user.hover(await screen.findByText(/Apple Inc./i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // then
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText(/예측 지표 생성/i)).toBeInTheDocument();
  });

  it('사용자가 지표 편집 버튼을 클릭하고 예측 지표 생성 버튼을 클릭하면, 예측 지표 리스트에서 생성한 예측 지표를 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorDialogMenu />
        <IndicatorList />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );

    await user.hover(await screen.findByText(/Apple Inc./i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );
    await user.click(await screen.findByRole('menuitem', { name: 'create-custom-forecast-indicator' }));

    // then
    expect(await screen.findByText(/새로운 예측 지표/i)).toBeVisible();
  });
});

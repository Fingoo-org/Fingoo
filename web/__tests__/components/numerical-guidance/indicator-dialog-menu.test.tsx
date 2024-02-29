import { act, render, renderHook, screen } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';
import { resetAllStore } from '@/app/store/stores/reset-store';
import IndicatorList from '@/app/ui/components/numerical-guidance/molecule/indicator-list';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import userEvent from '@testing-library/user-event';
import IndicatorDialogMenu from '@/app/ui/components/numerical-guidance/molecule/indicator-dialog-menu';
import CustomForecastIndicatorList from '@/app/ui/components/numerical-guidance/molecule/custom-forecast-indicator-list';

describe('indicator-dialog-menu', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('메타데이터가 선택되었을 때, 사용자가 지표 편집 버튼을 클릭하면, 편집할 수 있는 dialog menu룰 보여준다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorDialogMenu />
        <IndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });
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

  it('메타데이터가 선택되었을 때, 사용자가 지표 편집 버튼을 클릭하고 예측 지표 생성 버튼을 클릭하면, 예측 지표 리스트에서 생성한 예측 지표를 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <IndicatorDialogMenu />
        <IndicatorList />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );
    const { result: store } = renderHook(() => useNumericalGuidanceStore());
    act(() => {
      store.current.actions.selectMetadata('1');
    });

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

import { act, render, renderHook, screen, waitFor, fireEvent } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import userEvent from '@testing-library/user-event';
import CustomForecastIndicatorDialogMenu from '@/app/ui/components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-dialog-menu/custom-forecast-indicator-dialog-menu';
import CustomForecastIndicatorList from '@/app/ui/components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-list/custom-forecast-indicator-list';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// https://github.com/testing-library/user-event/discussions/1087
window.HTMLElement.prototype.hasPointerCapture = jest.fn();
window.HTMLElement.prototype.setPointerCapture = jest.fn();

const selectIndicatorBoardMetadata = () => {
  const { result: store } = renderHook(() => useWorkspaceStore());
  act(() => {
    store.current.actions.selectMetadata('1');
  });
};

describe('CustomForecastIndicatorDialogMenu', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
    selectIndicatorBoardMetadata();
  });

  it('사용자가 지표 편집 버튼을 클릭하면, 편집할 수 있는 dialog menu룰 보여준다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <CustomForecastIndicatorDialogMenu />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    // when
    await user.hover(await screen.findByText(/customForecastIndicator1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // then
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('customForecastIndicator1')).toBeInTheDocument();
  });

  describe('SourceIndicatorSliderGroup', () => {
    it('사용자가 가중치를 변경하면, 가중치가 변경된다.', async () => {
      // given
      const user = userEvent.setup();
      render(
        <SWRProviderWithoutCache>
          <CustomForecastIndicatorDialogMenu />
          <CustomForecastIndicatorList />
        </SWRProviderWithoutCache>,
      );
      await user.hover(await screen.findByText(/customForecastIndicator1/i));
      await user.click(
        (
          await screen.findAllByRole('button', {
            name: 'edit',
          })
        )[0],
      );

      // when
      const slider = await screen.findByRole('slider');
      await user.click(slider);
      await user.keyboard('[ArrowRight][ArrowRight][ArrowRight]');

      // then
      expect(slider).toHaveAttribute('aria-valuenow', '13');
    });
    it('사용자가 가중치를 변경하면, 적용 버튼이 활성화된다.', async () => {
      // given
      const user = userEvent.setup();
      render(
        <SWRProviderWithoutCache>
          <CustomForecastIndicatorDialogMenu />
          <CustomForecastIndicatorList />
        </SWRProviderWithoutCache>,
      );
      await user.hover(await screen.findByText(/customForecastIndicator1/i));
      await user.click(
        (
          await screen.findAllByRole('button', {
            name: 'edit',
          })
        )[0],
      );

      // when
      const slider = await screen.findByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '10');
      await user.click(slider);
      await user.keyboard('[ArrowRight][ArrowRight][ArrowRight]');

      // then
      expect(await screen.findByRole('button', { name: 'apply' })).toBeEnabled();
    });
  });

  it('사용자가 적용 버튼을 클릭하면, 변경된 지표가 적용된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <CustomForecastIndicatorDialogMenu />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/customForecastIndicator1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // when
    const slider = await screen.findByRole('slider');
    await user.click(slider);
    await user.keyboard('[ArrowRight][ArrowRight][ArrowRight]');
    await user.click(await screen.findByRole('button', { name: 'apply' }));

    // then
    await waitFor(() => expect(screen.queryByRole('button', { name: 'apply' })).not.toBeEnabled());
    expect(slider).toHaveAttribute('aria-valuenow', '13');
  });

  it('사용자가 삭제 버튼을 클릭하면, 지표가 삭제된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <CustomForecastIndicatorDialogMenu />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/customForecastIndicator1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // when
    await user.click(await screen.findByRole('button', { name: 'delete' }));

    // then
    expect(await screen.queryByText(/customForecastIndicator1/i)).toBeNull();
  });

  it('사용자가 이름을 변경하면, 이름이 변경된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <CustomForecastIndicatorDialogMenu />
        <CustomForecastIndicatorList />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/customForecastIndicator1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // when
    const input = await screen.findByDisplayValue('customForecastIndicator1');
    await user.clear(input);
    await user.type(input, 'newCustomForecastIndicator1');

    // then
    expect(input).toHaveValue('newCustomForecastIndicator1');
  });
});

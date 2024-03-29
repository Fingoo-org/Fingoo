import { act, findByText, getByText, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { resetAllStore } from '@/app/store/stores/reset-store';
import IndicatorsChart from '@/app/ui/components/numerical-guidance/indicator/indicators-chart';
import IndicatorList from '@/app/ui/components/numerical-guidance/indicator/indicator-list';
import CustomForecastIndicatorList from '@/app/ui/components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-list/custom-forecast-indicator-list';

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
    expect(await screen.findByText(/메타데이터를 선택해주세요/i)).toBeInTheDocument();
  });

  describe('IndicatorList', () => {
    it('선택한 메타데이터가 있을 때, 지표를 선택하면, 차트를 보여준다.', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <IndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      await userEvent.click(await screen.findByText(/Apple Inc./i));

      // then
      expect(await screen.findByDisplayValue('metadata1')).toBeInTheDocument();
      expect(await screen.findByText(/AAPL/i)).toBeInTheDocument();
    });

    it('선택한 메타데이터가 있을 때, 지표를 선택하고 다시 선택하면, 차트를 숨긴다.', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <IndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      await userEvent.click(await screen.findByText(/Apple Inc./i));
      await userEvent.click(await screen.findByText(/Apple Inc./i));

      // then
      expect(await screen.findByText(/선택한 지표가 없습니다. 지표를 선택해주세요/i)).toBeInTheDocument();
      expect(screen.queryByText(/AAPL/i)).not.toBeInTheDocument();
    });

    it('선택한 메타데이터가 있을 때, 지표를 선택하고 토글 버튼을 클릭하면, 자세한 차트를 보여준다', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <IndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      await userEvent.click(await screen.findByText(/Apple Inc./i));
      expect(screen.queryByTestId('advanced-multi-line-chart')).not.toBeInTheDocument();

      await userEvent.click(await screen.findByRole('button', { name: 'toggle-button' }));

      // then
      expect(await screen.findByTestId('advanced-multi-line-chart')).toBeInTheDocument();
      expect(await screen.findByText(/AAPL/i)).toBeInTheDocument();
    });
  });

  describe('CustomForecastIndicatorList', () => {
    it('선택한 메타데이터가 있을 때, 커스텀 지표를 선택하면, 차트를 보여준다.', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <CustomForecastIndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      await userEvent.click(await screen.findByText(/삼성전자 예측 지표/i));

      // then
      const indicatorsChart = await screen.findByTestId('indicators-chart');
      expect(await screen.findByDisplayValue('metadata1')).toBeInTheDocument();
      expect(await findByText(indicatorsChart, /삼성전자 예측 지표/i)).toBeInTheDocument();
    });

    it('선택한 메타데이터가 있을 때, 커스텀 지표를 선택하고 다시 선택하면, 차트를 숨긴다.', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <CustomForecastIndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      const customForecastIndicatorList = await screen.findByTestId('custom-forecast-indicator-list');
      await userEvent.click(getByText(customForecastIndicatorList, /삼성전자 예측 지표/i));
      await userEvent.click(getByText(customForecastIndicatorList, /삼성전자 예측 지표/i));

      // then
      expect(await screen.findByText(/선택한 지표가 없습니다. 지표를 선택해주세요/i)).toBeInTheDocument();
    });

    it('선택한 메타데이터가 있을 때, 커스텀 지표를 선택하고 토글 버튼을 클릭하면, 자세한 차트를 보여준다', async () => {
      // given
      render(
        <SWRProviderWithoutCache>
          <IndicatorsChart />
          <CustomForecastIndicatorList />
        </SWRProviderWithoutCache>,
      );
      const { result: store } = renderHook(() => useWorkspaceStore());
      act(() => {
        store.current.actions.selectMetadata('1');
      });
      await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());

      // when
      const customForecastIndicatorList = await screen.findByTestId('custom-forecast-indicator-list');
      await userEvent.click(getByText(customForecastIndicatorList, /삼성전자 예측 지표/i));
      expect(screen.queryByTestId('advanced-multi-line-chart')).not.toBeInTheDocument();

      await userEvent.click(await screen.findByRole('button', { name: 'toggle-button' }));

      // then
      expect(await screen.findByTestId('advanced-multi-line-chart')).toBeInTheDocument();
      const indicatorsChart = await screen.findByTestId('indicators-chart');
      expect(await findByText(indicatorsChart, /삼성전자 예측 지표/i)).toBeInTheDocument();
    });
  });
});

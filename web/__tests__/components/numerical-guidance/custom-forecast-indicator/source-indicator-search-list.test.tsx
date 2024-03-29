import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import userEvent from '@testing-library/user-event';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import SourceIndicatorSearchList from '@/app/ui/components/numerical-guidance/custom-forecast-indicator/source-indicator-search-list';

describe('SourceIndicatorSearchList', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('커스텀 예측 지표를 선택했을 때, 지표 리스트를 보여준다', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });

    // when
    // then
    expect(await screen.findByText('AAPL(Apple Inc.)')).toBeInTheDocument();
    expect(await screen.findByText('MSFT(Microsoft Corporation)')).toBeInTheDocument();
    expect(await screen.findByText('GOOG(Alphabet Inc.)')).toBeInTheDocument();
  });

  it('검색바에 지표 ticker를 입력하면, 검색된 지표 리스트를 보여준다', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });

    // when
    const input = await screen.findByDisplayValue('');
    await userEvent.type(input, 'aapl');

    // then
    await waitFor(() => expect(screen.queryByText('MSFT(Microsoft Corporation)')).not.toBeInTheDocument());
    expect(await screen.findByText('AAPL(Apple Inc.)')).toBeInTheDocument();
  });

  it('검색바에 지표 이름을 입력하면, 검색된 지표 리스트를 보여준다', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });

    // when
    const input = await screen.findByDisplayValue('');
    await userEvent.type(input, 'apple');

    // then
    await waitFor(() => expect(screen.queryByText('MSFT(Microsoft Corporation)')).not.toBeInTheDocument());
    expect(await screen.findByText('AAPL(Apple Inc.)')).toBeInTheDocument();
  });

  it('지표를 클릭하면, 선택된 지표가 재료 지표로 추가된다', async () => {
    //given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });
    expect(await screen.findAllByRole('tab', { selected: true })).toHaveLength(2);

    //when
    const indicator = await screen.findByText('MSFT(Microsoft Corporation)');
    userEvent.click(indicator);

    await waitFor(() => expect(screen.queryAllByRole('tab', { selected: true })).toHaveLength(3));
  });

  it('지표를 선택한 후 다시 클릭하면, 선택된 지표가 재료 지표에서 제거된다', async () => {
    //given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });
    expect(await screen.findAllByRole('tab', { selected: true })).toHaveLength(2);

    //when
    const indicator = await screen.findByText('MSFT(Microsoft Corporation)');
    userEvent.click(indicator);
    await waitFor(() => expect(screen.queryAllByRole('tab', { selected: true })).toHaveLength(3));
    userEvent.click(indicator);

    await waitFor(() => expect(screen.queryAllByRole('tab', { selected: true })).toHaveLength(2));
  });

  it('target 지표를 선택하면, 선택된 지표가 제거되지 않는다.', async () => {
    //given
    render(
      <SWRProviderWithoutCache>
        <SourceIndicatorSearchList />
      </SWRProviderWithoutCache>,
    );
    const { result } = renderHook(() => useWorkspaceStore());
    act(() => {
      result.current.actions.selectCustomForecastIndicatorById('11');
    });
    expect(await screen.findAllByRole('tab', { selected: true })).toHaveLength(2);

    //when
    const targetIndicator = await screen.findByText('AAPL(Apple Inc.)');
    userEvent.click(targetIndicator);

    expect(await screen.findAllByRole('tab', { selected: true })).toHaveLength(2);
  });
});

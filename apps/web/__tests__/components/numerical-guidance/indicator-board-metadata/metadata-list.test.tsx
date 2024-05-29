import { findByText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetadataList from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-list/metadata-list';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import IndicatorListResult from '@/app/ui/components/domain/numerical-guidance/indicator/indicator-list/indicator-list-result';
import { resetAllStore } from '@/app/store/stores/reset-store';
import MetadataListItemRowDialogMenu from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-list-item/metadata-list-item-row-dialog-menu';

describe('MetadataList', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });
  it('메타데이터 리스트를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );

    // when
    // then
    expect(await screen.findByText(/metadata1/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata2/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata3/i)).toBeInTheDocument();
  });

  it('사용자가 생성 버튼을 클릭하면, 생성한 메타데이터가 추가된 메타데이터 리스트를 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when
    await user.click(screen.getByRole('button', { name: /메타데이터 추가/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(4);
  });

  it('사용자가 생성 버튼을 두번 클릭하면, 생성한 메타데이터가 2개 추가된 메타데이터 리스트를 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when;
    await user.click(screen.getByRole('button', { name: /메타데이터 추가/i }));
    await user.click(screen.getByRole('button', { name: /메타데이터 추가/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(5);
  });

  it('사용자가 메타데이터를 클릭하면, 메타데이터가 선택된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when
    expect(screen.queryByRole('tab', { selected: true })).toBeNull();
    await user.click(await screen.findByText(/metadata1/i));

    // then
    expect(await screen.findByRole('tab', { selected: true })).toBeInTheDocument();
  });

  it('사용자가 메타데이터 리스트의 확장 버튼을 클릭하면, 메타데이터 리스트가 확장된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when
    await user.click(screen.getAllByRole('button', { expanded: false })[0]);

    // then
    expect(await screen.findByText(/지표를 추가해 주세요/i)).toBeInTheDocument();
  });

  it('사용자가 메타데이터를 선택하고 확장했을 때, 지표를 추가하고 리스트의 , 메타데이터에 지표 리스트가 보여진다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
        <IndicatorListResult />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());
    await user.click(await screen.findByText(/metadata1/i));
    await user.click(screen.getAllByRole('button', { expanded: false })[0]);

    // when
    await waitFor(() => expect(screen.getByRole('tablist')).toBeVisible());
    await user.click(await screen.findByText(/AAPL/i));

    // then
    const metadataList = screen.getByTestId('metadata-list');
    expect(await findByText(metadataList, /AAPL/i)).toBeInTheDocument();
    expect(screen.queryByText(/지표를 추가해 주세요/i)).toBeNull();
  });

  it('메타데이터를 선택하고 지표를 추가했을 때, 지표 편집 버튼을 클릭하면, 지표 편집 dialog menu를 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
        <IndicatorListResult />
        <MetadataListItemRowDialogMenu />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());
    await user.click(await screen.findByText(/metadata1/i));
    await user.click(screen.getAllByRole('button', { expanded: false })[0]);
    await user.click(await screen.findByText(/AAPL/i));
    expect(screen.queryByRole('dialog')).toBeNull();

    // when
    await user.click(await screen.findByRole('button', { name: /metadata-item-row-edit-button/i }));

    // then
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText(/Delete/i)).toBeInTheDocument();
  });

  it('메타데이터를 선택하고 지표를 추가했을 때, 지표 편집 dialog에서 지표를 삭제하면, 지표가 삭제된다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
        <IndicatorListResult />
        <MetadataListItemRowDialogMenu />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());
    await user.click(await screen.findByText(/metadata1/i));
    await user.click(screen.getAllByRole('button', { expanded: false })[0]);
    await user.click(await screen.findByText(/AAPL/i));
    await user.click(await screen.findByRole('button', { name: /metadata-item-row-edit-button/i }));

    // when
    await user.click(await screen.findByText(/Delete/i));

    // then
    expect(await screen.findByText(/지표를 추가해 주세요/i)).toBeInTheDocument();
  });
});

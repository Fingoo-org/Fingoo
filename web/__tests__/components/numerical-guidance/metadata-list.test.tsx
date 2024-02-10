import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetadataList from '@/app/ui/components/numerical-guidance/metadata-list';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';

describe('MetadataList', () => {
  beforeEach(() => {
    resetMockDB();
  });
  it('메타데이터 리스트를 조회한다.', async () => {
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

  it('사용자가 생성 버튼을 클릭하면, 생성한 메타데이터가 추가된 메타데이터 리스트를 조회한다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when
    await user.click(screen.getByRole('button', { name: /create/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(4);
  });

  it('사용자가 생성 버튼을 두번 클릭하면, 생성한 메타데이터가 2개 추가된 메타데이터 리스트를 조회한다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when;
    await user.click(screen.getByRole('button', { name: /create/i }));
    await user.click(screen.getByRole('button', { name: /create/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(5);
  });

  it('사용자가 메타데이터를 선택하면, 선택한 메타데이터가 표시된다.', async () => {
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
});

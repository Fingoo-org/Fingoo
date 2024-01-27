import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetadataTabPanel from '@/app/ui/pages/workspace/metadata-tab-panel';
import { SWRProviderWithoutCache } from '@/app/api/swr-provider';
import { resetMockDB } from '@/app/mocks/mock-db';

describe('MetadataTabPanel', () => {
  beforeEach(() => {
    resetMockDB();
  });
  it('메타 데이터 조회하기', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <MetadataTabPanel />
      </SWRProviderWithoutCache>,
    );
    // when
    // then
    expect(await screen.findByText(/metadata1/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata2/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata3/i)).toBeInTheDocument();
  });

  it('메타 데이터 생성하기', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataTabPanel />
      </SWRProviderWithoutCache>,
    );
    // when
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /create/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(4);
  });

  it('메타 데이터 두번 생성하기', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataTabPanel />
      </SWRProviderWithoutCache>,
    );
    // when;
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /create/i }));
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(5);
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetadataTabPanel from '@/app/ui/pages/workspace/metadata-tab-panel';
import { SWRProviderWithoutCache } from '@/app/api/swr-provider';
import { resetMockDB } from '@/app/mocks/mock-db';

describe('MetadataTabPanel', () => {
  beforeEach(() => {
    resetMockDB();
  });
  it('메타데이터 리스트를 조회한다.', async () => {
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

  it('사용자가 생성 버튼을 클릭하면, 생성한 메타데이터가 추가된 메타데이터 리스트를 조회한다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataTabPanel />
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
        <MetadataTabPanel />
      </SWRProviderWithoutCache>,
    );
    await waitFor(async () => expect(await screen.findByText(/metadata1/i)).toBeInTheDocument());

    // when;
    await user.click(screen.getByRole('button', { name: /create/i }));
    await user.click(screen.getByRole('button', { name: /create/i }));

    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(5);
  });
});

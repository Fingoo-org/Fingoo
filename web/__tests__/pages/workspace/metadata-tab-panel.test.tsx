import { act, render, screen, cleanup } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import userEvent from '@testing-library/user-event';
import MetadataTabPanel from '@/app/ui/pages/workspace/metadata-tab-panel';

describe('MetadataTabPanel', () => {
  beforeEach(() => {
    resetAllSlice();
  });

  it('메타 데이터 조회하기', async () => {
    // given
    render(<MetadataTabPanel />);
    // when
    // then
    expect(await screen.findByText(/metadata1/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata2/i)).toBeInTheDocument();
    expect(await screen.findByText(/metadata3/i)).toBeInTheDocument();
  });

  it('메타 데이터 생성하기', async () => {
    // given
    const user = userEvent.setup();
    render(<MetadataTabPanel />);
    // when
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /create/i }));
    });
    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(4);
  });

  it('메타 데이터 두번 생성하기', async () => {
    // given
    const user = userEvent.setup();
    render(<MetadataTabPanel />);
    // when;
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /create/i }));
      await user.click(screen.getByRole('button', { name: /create/i }));
    });
    // then
    expect(await screen.findAllByText(/metadata[0-9]/i)).toHaveLength(5);
  });
});

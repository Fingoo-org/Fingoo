import { act, render, screen, cleanup } from '@testing-library/react';
import { resetAllSlice } from '@/app/store';
import userEvent from '@testing-library/user-event';
import MetadataTabPanel from '@/app/ui/pages/workspace/metadata-tab-panel';

describe('MetadataTabPanel', () => {
  beforeEach(() => {
    resetAllSlice();
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
    expect(await screen.findByText(/metadata1/i)).toBeInTheDocument();
    cleanup();
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
    expect(await screen.findAllByText(/metadata1/i)).toHaveLength(2);
  });
});

import { render, screen } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import MetadataDialogMenu from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-dialog-menu/metadata-dialog-menu';
import MetadataDeleteDialog from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-delete-dialog';
import userEvent from '@testing-library/user-event';
import MetadataList from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-list/metadata-list';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('MetadataDeleteDialog', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('메타데이터 편집 dialog menu가 띄어져 있을 때, 사용자가 dialog에서 삭제 버튼을 클릭하면, 삭제할 수 있는 alert dialog 를 보여준다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetadataList />
        <MetadataDeleteDialog />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/metadata1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // when
    await user.click(await screen.findByRole('menuitem', { name: 'Delete metadata' }));

    // then
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('삭제할 수 있는 alert dialog가 보여졌을 때, 사용자가 확인 버튼을 클릭하면, alert dialog를 숨긴다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetadataList />
        <MetadataDeleteDialog />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/metadata1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete metadata' }));

    // when
    expect(screen.queryByRole('dialog')).not.toBeNull();
    await user.click(await screen.findByRole('button', { name: 'Confirm' }));

    // then
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('삭제할 수 있는 alert dialog가 보여졌을 때, 사용자가 취소 버튼을 클릭하면, alert dialog를 숨긴다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetadataList />
        <MetadataDeleteDialog />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/metadata1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete metadata' }));

    // when
    expect(screen.queryByRole('dialog')).not.toBeNull();
    await user.click(await screen.findByRole('button', { name: 'Cancel' }));

    // then
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('삭제할 수 있는 alert dialog가 보여졌을 때, 사용자가 확인 버튼을 클릭하면, 메타데이터 리스트에서 해당 메타데이터가 삭제된다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetadataList />
        <MetadataDeleteDialog />
      </SWRProviderWithoutCache>,
    );
    await user.hover(await screen.findByText(/metadata1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete metadata' }));

    // when
    await user.click(await screen.findByRole('button', { name: 'Confirm' }));

    // then
    expect(screen.queryByText(/metadata1/i)).toBeNull();
  });
});

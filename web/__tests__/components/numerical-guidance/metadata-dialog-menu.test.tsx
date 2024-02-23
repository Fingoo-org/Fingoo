import { render, screen } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/store/querys/swr-provider';
import { resetMockDB } from '@/app/mocks/db.mock';
import { resetAllStore } from '@/app/store/stores/reset-store';
import MetdataList from '@/app/ui/components/numerical-guidance/molecule/metadata-list';
import MetadataDialogMenu from '@/app/ui/components/numerical-guidance/molecule/metadata-dialog-menu/metadata-dialog-menu';
import userEvent from '@testing-library/user-event';

describe('MetadataDialogMenu', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('사용자가 메타데이터 편집 버튼을 클릭하면, 편집할 수 있는 dialog menu룰 보여준다', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetdataList />
      </SWRProviderWithoutCache>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();

    // when
    await user.hover(await screen.findByText(/metadata1/i));
    await user.click(
      (
        await screen.findAllByRole('button', {
          name: 'edit',
        })
      )[0],
    );

    // then
    expect(await screen.findByDisplayValue('metadata1')).toBeInTheDocument();
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText(/Delete/i)).toBeInTheDocument();
  });

  it('dialog menu를 보고 있을 때, 사용자가 dialog menu 내부의 item을 클릭하면, dialog menu를 숨긴다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetdataList />
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
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // when
    await user.click(await screen.findByText(/Delete/i));

    // then
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('dialog menu를 보고 있을 때, 사용자가 메타데이터 이름을 수정하면, dialog menu와 metadata list에 수정한 이름을 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <MetadataDialogMenu />
        <MetdataList />
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
    const input = await screen.findByDisplayValue('metadata1');

    // when
    await userEvent.clear(input);
    await userEvent.type(input, 'changedata');

    // then
    expect(await screen.findByDisplayValue('changedata')).toBeInTheDocument();
    expect(await screen.findByText(/changedata/i)).toBeInTheDocument();
  });
});

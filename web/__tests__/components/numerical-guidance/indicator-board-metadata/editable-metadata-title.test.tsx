import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import EditableMetadataTittle from '@/app/ui/components/numerical-guidance/indicator-board-metadata/editable-metadata-title';
import MetadataList from '@/app/ui/components/numerical-guidance/indicator-board-metadata/metadata-list/metadata-list';

describe('EditableMetadataTittle', () => {
  beforeEach(() => {
    resetMockDB();
    resetAllStore();
  });

  it('메타데이터가 선택되지 않았을 때, 선택된 메타데이터가 없다는 표시를 보여준다.', async () => {
    // given
    render(
      <SWRProviderWithoutCache>
        <EditableMetadataTittle />
        <MetadataList />
      </SWRProviderWithoutCache>,
    );

    // when
    // then
    expect(await screen.findByDisplayValue('No metadata')).toBeInTheDocument();
  });

  it('메타데이터가 선택되었을 때, 선택된 메타데이터 이름을 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <EditableMetadataTittle />
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await user.click(await screen.findByText(/metadata1/i));

    // when
    // then
    expect(await screen.findByDisplayValue('metadata1')).toBeInTheDocument();
  });

  it('사용자가 메타데이터 이름을 변경하면, 변경한 메타데이터 이름을 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <EditableMetadataTittle />
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await user.click(await screen.findByText(/metadata1/i));

    // when
    const input = await screen.findByDisplayValue('metadata1');
    await userEvent.clear(input);
    await userEvent.type(input, 'changedata');

    // then
    expect(await screen.findByDisplayValue('changedata')).toBeInTheDocument();
  });

  it('사용자가 메타데이터 이름을 변경하면, 메타데이터 리스트에도 변경한 메타데이터 이름을 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <EditableMetadataTittle />
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await user.click(await screen.findByText(/metadata1/i));

    // when
    const input = await screen.findByDisplayValue('metadata1');
    await userEvent.clear(input);
    await userEvent.type(input, 'changedata');

    // then
    expect(await screen.findByDisplayValue('changedata')).toBeInTheDocument();
    expect(await screen.findByText('changedata')).toBeInTheDocument();
  });

  it('사용자가 메타데이터 이름을 변경하면, 메타데이터 리스트에도 변경한 메타데이터 이름을 debounce하여 보여준다.', async () => {
    // given
    const user = userEvent.setup();
    render(
      <SWRProviderWithoutCache>
        <EditableMetadataTittle />
        <MetadataList />
      </SWRProviderWithoutCache>,
    );
    await user.click(await screen.findByText(/metadata1/i));

    // when
    const input = await screen.findByDisplayValue('metadata1');
    await userEvent.clear(input);
    await userEvent.type(input, 'changedata');

    // then
    expect(screen.queryByText('changedata')).toBeNull();
    expect(await screen.findByDisplayValue('changedata')).toBeInTheDocument();
    expect(await screen.findByText('changedata')).toBeInTheDocument();
  });
});

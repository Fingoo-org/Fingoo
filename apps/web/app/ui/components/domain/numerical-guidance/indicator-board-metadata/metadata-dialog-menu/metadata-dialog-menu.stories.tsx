import type { Meta, StoryObj } from '@storybook/react';

import MetadataDialogMenu from './metadata-dialog-menu';
import { useDialog } from '../../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useEffect } from 'react';

const meta = {
  title: 'numerical-guidance/molecule/MetadataDialogMenu',
  component: MetadataDialogMenu,
} satisfies Meta<typeof MetadataDialogMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_EDIT_MENU);

    useEffect(() => {
      openDialogWithPayload({
        id: '1',
        name: 'metadata1',
        indicators: [],
      });
    }, []);

    return <MetadataDialogMenu />;
  },
};

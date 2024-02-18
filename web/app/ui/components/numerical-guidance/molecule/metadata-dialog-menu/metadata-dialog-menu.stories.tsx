import type { Meta, StoryObj } from '@storybook/react';

import MetadataDialogMenu from './metadata-dialog-menu';
import { useDialogMenu } from '../../../view/molocule/dialog-menu';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useEffect } from 'react';

const meta = {
  title: 'Example/MetadataDialogMenu',
  component: MetadataDialogMenu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MetadataDialogMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { openDialogMenuWithPayload } = useDialogMenu(DIALOG_KEY.METADATA_EDIT_MENU);

    useEffect(() => {
      openDialogMenuWithPayload({
        id: '1',
        name: 'metadata1',
        indicators: [],
      });
    }, []);

    return <MetadataDialogMenu />;
  },
};

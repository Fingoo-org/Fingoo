import type { Meta, StoryObj } from '@storybook/react';

import ImageSharePopover from './image-share-popover';

const meta = {
  title: 'view/molecule/ImageSharePopover',
  component: ImageSharePopover,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageSharePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 's12jnjndasj.com',
    baseUrl: 'localhost:3000//test/test',
    onDownloadImage: () => {},
  },
};

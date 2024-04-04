import type { Meta, StoryObj } from '@storybook/react';

import ImageSharePopover from './image-share-popover';

const meta = {
  title: 'view/molecule/ImageSharePopover',
  component: ImageSharePopover,
  decorators: [
    (Story) => (
      <div className="h-80 w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageSharePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

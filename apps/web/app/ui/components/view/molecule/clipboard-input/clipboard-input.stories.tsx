import type { Meta, StoryObj } from '@storybook/react';

import ClipboardInput from './clipboard-input';
import Toaster from '../toast/toaster';

const meta = {
  title: 'view/molecule/ClipboardInput',
  component: ClipboardInput,
  decorators: [
    (Story: React.ComponentType) => (
      <div>
        <div>
          <Story />
        </div>
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof ClipboardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    copyUrl: 'https://www.google.com',
  },
};

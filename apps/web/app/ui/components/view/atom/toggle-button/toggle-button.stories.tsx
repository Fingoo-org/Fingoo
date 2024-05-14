import type { Meta, StoryObj } from '@storybook/react';

import ToggleButton from './toggle-button';

const meta = {
  title: 'view/atom/ToggleButton',
  component: ToggleButton,
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '자세한 차트',
  },
};

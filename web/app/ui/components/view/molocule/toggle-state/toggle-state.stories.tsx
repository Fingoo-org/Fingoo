import type { Meta, StoryObj } from '@storybook/react';

import ToggleState from './toggle-state';

const meta = {
  title: 'view/molecule/ToggleState',
  component: ToggleState,
} satisfies Meta<typeof ToggleState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: ['단일', '멀티'],
    selectedState: '단일',
  },
};

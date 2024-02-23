import type { Meta, StoryObj } from '@storybook/react';

import TinyInput from './tiny-input';

const meta = {
  title: 'view/atom/TinyInput',
  component: TinyInput,
} satisfies Meta<typeof TinyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '',
  },
};

export const WithResetButton: Story = {
  args: {
    defaultValue: '',
    withResetButton: true,
  },
};

export const WithFullText: Story = {
  args: {
    defaultValue: 'Hello ssssssssssssssssssssssssssss',
  },
};

export const WithResetButtonAndFullText: Story = {
  args: {
    defaultValue: 'Hello ssssssssssssssssssssssssssssss',
    withResetButton: true,
  },
};

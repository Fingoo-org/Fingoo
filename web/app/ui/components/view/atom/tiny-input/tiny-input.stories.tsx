import type { Meta, StoryObj } from '@storybook/react';

import TinyInput from './tiny-input';

const meta = {
  title: 'Example/TinyInput',
  component: TinyInput,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TinyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const WithResetButton: Story = {
  args: {
    value: '',
    withResetButton: true,
  },
};

export const WithFullText: Story = {
  args: {
    value: 'Hello ssssssssssssssssssssssssssss',
  },
};

export const WithResetButtonAndFullText: Story = {
  args: {
    value: 'Hello ssssssssssssssssssssssssssssss',
    withResetButton: true,
  },
};

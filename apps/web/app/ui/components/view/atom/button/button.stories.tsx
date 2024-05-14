import type { Meta, StoryObj } from '@storybook/react';

import { CheckCircleIcon } from '@heroicons/react/solid';

import Button from './button';

const meta = {
  title: 'view/atom/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

export const Light: Story = {
  args: {
    children: 'Button',
    variant: 'light',
  },
};

export const WithSize: Story = {
  args: {
    children: 'Button',
    size: 'lg',
  },
};

export const WithColor: Story = {
  args: {
    children: 'Button',
    color: 'green',
  },
};

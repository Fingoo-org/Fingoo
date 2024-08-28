import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './avatar';
import Logo from '@/public/fingoo-logo.ico';

const meta = {
  title: 'view/atom/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: Logo.src,
  },
};

export const SquareAvatar: Story = {
  args: {
    src: Logo.src,
    variant: 'square',
  },
};

export const BigCircleAvatar: Story = {
  args: {
    src: Logo.src,
    variant: 'big_circle',
  },
};

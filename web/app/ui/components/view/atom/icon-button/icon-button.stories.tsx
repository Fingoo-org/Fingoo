import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircleIcon } from '@heroicons/react/solid';

import IconButton from './icon-button';

const meta = {
  title: 'view/atom/IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: CheckCircleIcon,
  },
};

export const Outlined: Story = {
  args: {
    icon: CheckCircleIcon,
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    icon: CheckCircleIcon,
    disabled: true,
  },
};

export const WithColor: Story = {
  args: {
    icon: CheckCircleIcon,
    color: 'green',
  },
};

export const WithSize: Story = {
  args: {
    icon: CheckCircleIcon,
    size: 'lg',
  },
};

import type { Meta, StoryObj } from '@storybook/react';

import ToggleButton from './toggle-button';
import { CheckCircleIcon } from '@heroicons/react/solid';

const meta = {
  title: 'view/atom/ToggleButton',
  component: ToggleButton,
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'ToggleButton',
  },
};
export const Primary: Story = {
  args: {
    text: 'ToggleButton',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'ToggleButton',
    variant: 'secondary',
  },
};

export const Light: Story = {
  args: {
    text: 'ToggleButton',
    variant: 'light',
  },
};

export const WithIcon: Story = {
  args: {
    text: 'ToggleButton',
    icon: CheckCircleIcon,
  },
};

export const WithIconAndSize: Story = {
  args: {
    text: 'ToggleButton',
    icon: CheckCircleIcon,
    size: 'lg',
  },
};

export const WithActiveColor: Story = {
  args: {
    text: 'ToggleButton',
    activeColor: 'green',
  },
};

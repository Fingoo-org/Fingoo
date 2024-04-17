import type { Meta, StoryObj } from '@storybook/react';

import Callout from '.';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const meta = {
  title: 'view/molecule/Callout',
  component: Callout,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a callout',
  },
};

export const Destructive: Story = {
  args: {
    content: 'This is a callout',
    variant: 'destructive',
  },
};

export const Warning: Story = {
  args: {
    content: 'This is a callout',
    variant: 'warning',
  },
};

export const WithIcon: Story = {
  args: {
    content: 'This is a callout',
    icon: InfoCircledIcon,
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    content: 'This is a callout',
    icon: InfoCircledIcon,
    variant: 'destructive',
  },
};

export const WarningWithIcon: Story = {
  args: {
    content: 'This is a callout',
    icon: InfoCircledIcon,
    variant: 'warning',
  },
};

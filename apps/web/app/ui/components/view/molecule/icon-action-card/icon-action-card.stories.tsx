import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import IconActionCard from './icon-action-card';
import { Share2Icon } from '@radix-ui/react-icons';

const meta: Meta<typeof IconActionCard> = {
  title: 'view/molecule/IconActionCard',
  component: IconActionCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '커뮤니티에 공유',
    icon: Share2Icon,
    iconColor: 'black',
  },
};

export const WithCustomSize: Story = {
  args: {
    ...Default.args,
    iconSize: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const MultipleCards: Story = {
  render: (args) => (
    <div className="space-y-3">
      <IconActionCard {...args} text="저장하기" />
      <IconActionCard {...args} text="커뮤니티에 공유" />
      <IconActionCard {...args} text="복사하기" />
    </div>
  ),
  args: {
    ...Default.args,
  },
};

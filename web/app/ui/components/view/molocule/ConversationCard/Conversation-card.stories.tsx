import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ConversationCard from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const meta: Meta<typeof ConversationCard> = {
  title: 'view/molecule/ConversationCard',
  component: ConversationCard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    title: 'Card Test: defaultOpen: true',
    infoIcon: InfoCircledIcon,
    collapsibleIcon: ChevronDownIcon,
    initContent: ['첫 번째', '두 번째'],
  },
};

export const Closed: Story = {
  args: {
    defaultOpen: false,
    title: 'Card Test: defaultOpen: False',
    infoIcon: InfoCircledIcon,
    collapsibleIcon: ChevronDownIcon,
    initContent: ['첫 번째', '두 번째'],
  },
};

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
  render: (args) => (
    <div className="w-96">
      <ConversationCard defaultOpen={args.defaultOpen}>
        <ConversationCard.Header
          title="defaultOpen: true"
          infoIcon={InfoCircledIcon}
          collapsibleIcon={ChevronDownIcon}
        />
        <ConversationCard.Content initContent={['item1', 'item2']} />
      </ConversationCard>
    </div>
  ),
  args: {
    defaultOpen: true,
  },
};

export const CollapsibleFalse: Story = {
  render: (args) => (
    <div className="w-96">
      <ConversationCard defaultOpen={args.defaultOpen}>
        <ConversationCard.Header
          title="defaultOpen: false"
          infoIcon={InfoCircledIcon}
          collapsibleIcon={ChevronDownIcon}
        />
        <ConversationCard.Content initContent={['item1', 'item2']} />
      </ConversationCard>
    </div>
  ),
  args: {
    defaultOpen: false,
  },
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ConversationCard from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const meta: Meta<typeof ConversationCard> = {
  title: 'view/molecule/ConversationCard',
  component: ConversationCard,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ConversationCard defaultOpen={args.defaultOpen}>
      <ConversationCard.Header
        title="short conversation"
        infoIcon={InfoCircledIcon}
        collapsibleIcon={ChevronDownIcon}
      />
      <ConversationCard.Content
        initContent={[
          { role: 'user', text: 'welcome' },
          { role: 'assistant', text: 'nicetoMeetyou' },
        ]}
      />
    </ConversationCard>
  ),
  args: {
    defaultOpen: true,
  },
};

export const CollapsibleTrue: Story = {
  render: (args) => (
    <ConversationCard defaultOpen={args.defaultOpen}>
      <ConversationCard.Header
        title="long conversation scroll"
        infoIcon={InfoCircledIcon}
        collapsibleIcon={ChevronDownIcon}
      />
      <ConversationCard.Content
        initContent={[
          {
            role: 'user',
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
          {
            role: 'assistant',
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever ......",
          },
          {
            role: 'user',
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
        ]}
      />
    </ConversationCard>
  ),
  args: {
    defaultOpen: true,
  },
};

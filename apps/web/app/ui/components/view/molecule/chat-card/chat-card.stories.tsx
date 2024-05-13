import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChatCard from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const meta: Meta<typeof ChatCard> = {
  title: 'view/molecule/ChatCard',
  component: ChatCard,
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ChatCard defaultOpen={args.defaultOpen}>
      <ChatCard.Header title="short chat" infoIcon={InfoCircledIcon} collapsibleIcon={ChevronDownIcon} />
      <ChatCard.Content
        messages={[
          { id: '1', role: 'user', content: 'welcome' },
          { id: '2', role: 'assistant', content: 'nicetoMeetyou' },
        ]}
      />
    </ChatCard>
  ),
  args: {
    defaultOpen: true,
  },
};

export const LongMessageChat: Story = {
  render: (args) => (
    <ChatCard defaultOpen={args.defaultOpen}>
      <ChatCard.Header title="long chat scroll" infoIcon={InfoCircledIcon} collapsibleIcon={ChevronDownIcon} />
      <ChatCard.Content
        messages={[
          {
            id: '1',
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
          {
            id: '2',
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever ......",
          },
          {
            id: '3',
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
        ]}
      />
    </ChatCard>
  ),
  args: {
    defaultOpen: true,
  },
};

export const LongMessageLoadingChat: Story = {
  render: (args) => (
    <ChatCard defaultOpen={args.defaultOpen}>
      <ChatCard.Header title="long chat with loading" infoIcon={InfoCircledIcon} collapsibleIcon={ChevronDownIcon} />
      <ChatCard.Content
        messages={[
          {
            id: '1',
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
          {
            id: '2',
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever ......",
          },
          {
            id: '3',
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
          {
            id: '4',
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
          },
        ]}
      />
    </ChatCard>
  ),
  args: {
    defaultOpen: true,
  },
};

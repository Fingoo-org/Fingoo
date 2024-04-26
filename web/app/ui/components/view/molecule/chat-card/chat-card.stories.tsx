import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChatCard from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const meta: Meta<typeof ChatCard> = {
  title: 'view/molecule/ChatCard',
  component: ChatCard,
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
    <ChatCard defaultOpen={args.defaultOpen}>
      <ChatCard.Header title="short chat" infoIcon={InfoCircledIcon} collapsibleIcon={ChevronDownIcon} />
      <ChatCard.Content
        initContent={[
          { role: 'user', content: 'welcome', isLoading: false },
          { role: 'assistant', content: 'nicetoMeetyou', isLoading: false },
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
        initContent={[
          {
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
            isLoading: false,
          },
          {
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever ......",
            isLoading: false,
          },
          {
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
            isLoading: false,
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
        initContent={[
          {
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
            isLoading: false,
          },
          {
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever ......",
            isLoading: false,
          },
          {
            role: 'user',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
            isLoading: false,
          },
          {
            role: 'assistant',
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
            isLoading: true,
          },
        ]}
      />
    </ChatCard>
  ),
  args: {
    defaultOpen: true,
  },
};

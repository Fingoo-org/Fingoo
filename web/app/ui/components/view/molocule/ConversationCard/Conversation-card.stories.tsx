import type { Meta, StoryObj } from '@storybook/react';

import Card from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import ConversationCardHeader from './conversation-card-header';
import ConversationCardContent from './conversation-card-content';

const meta: Meta<typeof Card> = {
  title: 'view/molecule/Card',
  component: Card,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    children: (
      <div className="w-[1000px]">
        <ConversationCardHeader
          title="Card Test: defaultOpen:true"
          firstIcon={InfoCircledIcon}
          collapsibleIcon={ChevronDownIcon}
        />
        <ConversationCardContent initContent={['첫 번째', '두 번째']} />
      </div>
    ),
  },
};

export const False: Story = {
  args: {
    defaultOpen: false,
    children: (
      <div className="w-[1000px]">
        <ConversationCardHeader
          title="Card Test: False"
          firstIcon={InfoCircledIcon}
          collapsibleIcon={ChevronDownIcon}
        />
        <ConversationCardContent initContent={['첫 번째', '두 번째']} />
      </div>
    ),
  },
};

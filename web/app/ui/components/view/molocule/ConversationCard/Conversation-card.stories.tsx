import type { Meta, StoryObj } from '@storybook/react';

import ConversationCard from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import ConversationCardHeader from './conversation-card-header';
import ConversationCardContent from './conversation-card-content';

const meta: Meta<typeof ConversationCard> = {
  title: 'view/molecule/ConversationCard',
  component: ConversationCard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    children: (
      <div className="w-[1000px]">
        <ConversationCardHeader
          title="Card Test: defaultOpen: true"
          infoIcon={InfoCircledIcon}
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
          title="Card Test: defaultOpen: False"
          infoIcon={InfoCircledIcon}
          collapsibleIcon={ChevronDownIcon}
        />
        <ConversationCardContent initContent={['첫 번째', '두 번째']} />
      </div>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react';

import Card from '.';
import { InfoCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import CardHeader from './card-header';
import CardContent from './card-content';

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
      <div className=" w-[1000px]">
        <CardHeader title="Card Test: defaultOpen:true" firstIcon={InfoCircledIcon} secondIcon={ChevronDownIcon} />
        <CardContent>
          <div>첫 번째</div>
          <div>두 번째</div>
        </CardContent>
      </div>
    ),
  },
};

export const False: Story = {
  args: {
    defaultOpen: false,
    children: (
      <div className=" w-[1000px]">
        <CardHeader title="Card Test: False" firstIcon={InfoCircledIcon} secondIcon={ChevronDownIcon} />
        <CardContent>
          <div>첫 번째</div>
          <div>두 번째</div>
        </CardContent>
      </div>
    ),
  },
};

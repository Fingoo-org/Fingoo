import type { Meta, StoryObj } from '@storybook/react';

import ExpandableListItem from './expandable-list-item';

const meta = {
  title: 'view/molecule/ExpandableListItem',
  component: ExpandableListItem,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpandableListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react';

import ExpandableListItem from './expandable-list-item';
import { useState } from 'react';
import IconButton from '../../atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

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

export const Default = {
  render: () => {
    const [selected, setSelected] = useState(false);

    const hoverRender = () => {
      return (
        <IconButton
          aria-label="edit"
          // ref={iconButtonRef}
          // onClick={handleIconButton}
          icon={DotsHorizontalIcon}
          color={'violet'}
          className="mr-5"
        />
      );
    };

    return (
      <ExpandableListItem
        selected={selected}
        onSelect={() => setSelected(true)}
        onDeSelect={() => setSelected(false)}
        hoverRender={hoverRender}
      />
    );
  },
};

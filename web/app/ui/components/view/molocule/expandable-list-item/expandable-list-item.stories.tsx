import type { Meta, StoryObj } from '@storybook/react';

import ExpandableListItem from '.';
import { useState } from 'react';
import IconButton from '../../atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableContext from '../../../util/draggable-context';
import DraggableItem from '../../atom/draggable-item';

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
    const [values, setValues] = useState<{
      [key: string]: string[];
    }>({
      container1: ['item1', 'item2', 'item3'],
      container2: ['item4', 'item5', 'item6'],
    });

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
      >
        <ExpandableListItem.Title>
          <div className="p-2">Expandable List Item</div>
        </ExpandableListItem.Title>
        <ExpandableListItem.ExpandedContent>
          <DraggableContext
            values={values}
            onValueChange={(newValues) => {
              setValues(newValues);
            }}
          >
            {Object.keys(values).map((key, index) => (
              <SortableContext id={key} key={index} items={values[key]} strategy={verticalListSortingStrategy}>
                {values[key].map((item) => (
                  <DraggableItem key={item} id={item}>
                    {item}
                  </DraggableItem>
                ))}
              </SortableContext>
            ))}
          </DraggableContext>
        </ExpandableListItem.ExpandedContent>
      </ExpandableListItem>
    );
  },
};

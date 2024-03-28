import ListItem from '../../atom/list-item';
import Accordion from '../accordion';
import { useState } from 'react';
import { cn } from '@/app/utils/style';
import DraggableContext from '../../../util/draggable-context';
import DraggableItem from '../../atom/draggable-item';

type ExpandableListItemProps = {
  selected: boolean;
  onSelect: () => void;
  onDeSelect?: () => void;
  hoverRender?: () => JSX.Element;
};

export default function ExpandableListItem({ selected, onSelect, onDeSelect, hoverRender }: ExpandableListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<string[]>(['item1', 'item2', 'item3']);

  const handleValueChange = (value: string) => {
    if (value === 'item1') {
      setIsOpen(value === 'item1');
    } else {
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    }
  };

  const handleSelect = () => {
    onSelect();
  };

  const handleDeSelect = () => {
    onDeSelect?.();
  };

  const handleClick = () => {
    if (selected) {
      handleDeSelect();
    } else {
      handleSelect();
    }
  };

  return (
    <Accordion onValueChange={handleValueChange} type="single" collapsible>
      <Accordion.Item className="relative w-full" value="item1">
        <ListItem
          hoverDecorator={
            isOpen
              ? ({ children }) => {
                  return (
                    <div className="invisible absolute right-3 top-0.5 z-10  group-has-[:hover]:visible">
                      <div className="flex items-center justify-center">{children}</div>
                    </div>
                  );
                }
              : undefined
          }
          hoverRender={hoverRender}
        >
          <div
            onClick={handleClick}
            className={cn('h-full w-full rounded-2xl bg-white pl-4 ring-1 ring-blue-200', {
              'bg-blue-200 text-blue-900 opacity-80': selected,
            })}
          >
            <div className="flex items-center p-1 font-bold hover:text-blue-700 hover:opacity-20">선택해주세용</div>
            <Accordion.Content>
              <DraggableContext
                values={values}
                onDragEnd={(newValues) => {
                  setValues(newValues);
                }}
              >
                {values.map((value) => (
                  <DraggableItem key={value} id={value}>
                    {value}
                  </DraggableItem>
                ))}
              </DraggableContext>
            </Accordion.Content>
          </div>
        </ListItem>
        <div className={cn('absolute right-3 top-4 z-20 -translate-y-2/4')}>
          <Accordion.Trigger />
        </div>
      </Accordion.Item>
    </Accordion>
  );
}

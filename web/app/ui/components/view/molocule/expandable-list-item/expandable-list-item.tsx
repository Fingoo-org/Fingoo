import ListItem from '../../atom/list-item';
import Accordion from '../accordion';
import SelectableItem from '../../atom/selectable-item';
import { useRef, useState } from 'react';
import IconButton from '../../atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cn } from '@/app/utils/style';

export default function ExpandableListItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    setSelected(true);
  };

  const handleDeSelect = () => {
    setSelected(false);
  };

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
    <Accordion onValueChange={handleValueChange} type="single" collapsible>
      <Accordion.Item ref={ref} className="relative w-full" value="item1">
        <ListItem
          hoverDecorator={
            isOpen
              ? ({ children }) => {
                  return (
                    <div className="invisible absolute right-3 top-1 z-10  group-has-[:hover]:visible">
                      <div className="flex items-center justify-center">{children}</div>
                    </div>
                  );
                }
              : undefined
          }
          hoverRender={hoverRender}
        >
          <SelectableItem
            className="rounded-2xl"
            onSelect={handleSelect}
            onDeSelect={handleDeSelect}
            selected={selected}
          >
            <div className="flex items-center p-1 font-bold">선택해주세용</div>
            <Accordion.Content>
              <div className="divide-y">
                <div>01</div>
                <div>01</div>
                <div>01</div>
              </div>
            </Accordion.Content>
          </SelectableItem>
        </ListItem>
        <div className={cn('absolute right-3 top-4 z-20 -translate-y-2/4')}>
          <Accordion.Trigger />
        </div>
      </Accordion.Item>
    </Accordion>
  );
}

import ListItem from '../../atom/list-item';
import Accordion from '../accordion';
import SelectableItem from '../../atom/selectable-item';
import { useRef, useState } from 'react';
import IconButton from '../../atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

export default function ExpandableListItem() {
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <Accordion type="single" collapsible>
      <Accordion.Item ref={ref} className="relative w-full" value="item1">
        <ListItem hoverRender={hoverRender}>
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
        <div className="absolute right-3 top-2/4 z-20 -translate-y-2/4">
          <Accordion.Trigger />
        </div>
      </Accordion.Item>
    </Accordion>
  );
}

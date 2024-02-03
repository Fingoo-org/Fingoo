import ListItem from './list-item';
import React, { MouseEventHandler } from 'react';
import { PlusIcon } from '@heroicons/react/solid';

type SelectableListItemProps = {
  content: string;
  selected: boolean;
  style?: React.CSSProperties;
  onSelect: () => void;
  onDeSelect?: () => void;
};

export default function SelectableListItem({
  content,
  selected,
  style,
  onSelect,
  onDeSelect,
}: SelectableListItemProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => (selected ? onDeSelect?.() : onSelect());
  return (
    <button role="tab" aria-selected={`${selected}`} onClick={handleClick}>
      <ListItem style={style}>
        <div className="w-full flex justify-between">
          <div>{content}</div>
          {!selected && <PlusIcon className=" h-5 w-5 text-black" />}
        </div>
      </ListItem>
    </button>
  );
}

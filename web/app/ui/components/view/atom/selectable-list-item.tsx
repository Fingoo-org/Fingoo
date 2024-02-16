import ListItem from './list-item';
import React, { MouseEventHandler } from 'react';
import { clsx } from 'clsx';

type SelectableListItemProps = {
  selected: boolean;
  style?: React.CSSProperties;
  onSelect: () => void;
  onDeSelect?: () => void;
};

export default function SelectableListItem({
  children,
  selected,
  style,
  onSelect,
  onDeSelect,
}: React.PropsWithChildren<SelectableListItemProps>) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => (selected ? onDeSelect?.() : onSelect());
  return (
    <button
      className={clsx('w-full h-full', { 'bg-gray-500 text-white': selected })}
      role="tab"
      aria-selected={`${selected}`}
      onClick={handleClick}
    >
      <ListItem style={style}>{children}</ListItem>
    </button>
  );
}

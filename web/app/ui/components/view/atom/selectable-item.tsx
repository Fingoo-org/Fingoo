import React, { MouseEventHandler } from 'react';
import { clsx } from 'clsx';

type SelectableListItemProps = {
  selected: boolean;
  onSelect: () => void;
  onDeSelect?: () => void;
};

export default function SelectableItem({
  children,
  selected,
  onSelect,
  onDeSelect,
}: React.PropsWithChildren<SelectableListItemProps>) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => (selected ? onDeSelect?.() : onSelect());
  return (
    <button
      className={clsx('h-full w-full', { 'bg-gray-500 text-white': selected })}
      role="tab"
      aria-selected={`${selected}`}
      onClick={handleClick}
    >
      <div className=" flex h-full items-center rounded font-medium hover:bg-blue-50 hover:text-blue-700 hover:opacity-20">
        {children}
      </div>
    </button>
  );
}

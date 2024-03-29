import React, { MouseEventHandler } from 'react';
import { clsx } from 'clsx';
import { cn } from '@/app/utils/style';

type SelectableListItemProps = {
  selected: boolean;
  style?: React.CSSProperties;
  className?: string;
  onSelect: () => void;
  onDeSelect?: () => void;
};

export default function SelectableItem({
  children,
  selected,
  style,
  className,
  onSelect,
  onDeSelect,
}: React.PropsWithChildren<SelectableListItemProps>) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => (selected ? onDeSelect?.() : onSelect());
  return (
    <button
      className={cn(
        'h-full w-full rounded-full bg-white pl-4 ring-1 ring-blue-200',
        {
          'bg-blue-200 text-blue-900 opacity-80': selected,
        },
        className,
      )}
      role="tab"
      aria-selected={`${selected}`}
      onClick={handleClick}
      style={style}
    >
      <div className=" h-full rounded font-medium hover:bg-blue-50 hover:text-blue-700 hover:opacity-20">
        {children}
      </div>
    </button>
  );
}

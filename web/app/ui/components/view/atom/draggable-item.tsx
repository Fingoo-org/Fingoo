import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/app/utils/style';

type DraggableItemProps = {
  id: string;
  active: boolean;
};

type ItemProps = {
  style?: React.CSSProperties;
  className?: string;
};

export const Item = forwardRef<HTMLDivElement, React.PropsWithChildren<ItemProps>>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div {...props} style={style} ref={ref} className={cn('p-4', className)}>
        {children}
      </div>
    );
  },
);

Item.displayName = 'draggableItem';

export default function DraggableItem({ id, active, children }: React.PropsWithChildren<DraggableItemProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      className={cn({
        'opacity-20': active,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </Item>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';

type DraggableProps = {
  id: string;
  disabled?: boolean;
};

export default function Draggable({ id, disabled = false, children }: React.PropsWithChildren<DraggableProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="w-full" ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
}

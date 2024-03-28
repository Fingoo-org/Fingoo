import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Item } from '../view/atom/draggable-item';

type DraggableContextProps = {
  values: string[];
  onDragEnd: (newValue: string[]) => void;
};

export default function DraggableContext({
  values,
  children,
  onDragEnd,
}: React.PropsWithChildren<DraggableContextProps>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={values} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>{activeId ? <Item>{activeId}</Item> : null}</DragOverlay>
    </DndContext>
  );
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = values.indexOf(active.id as string);
      const newIndex = values.indexOf(over.id as string);

      onDragEnd(arrayMove(values, oldIndex, newIndex));
    }
  }
}

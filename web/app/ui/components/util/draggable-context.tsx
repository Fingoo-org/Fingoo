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
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Item } from '../view/atom/draggable/draggable-item';

type DraggableContextProps = {
  values: {
    [containerId: string]: string[];
  };
  onDragEnd: (newValue: { [key: string]: string[] }) => void;
  dragOverlayItem?: ({ children }: React.PropsWithChildren) => React.ReactElement;
  onDragOver?: (newValue: { [key: string]: string[] }) => void;
  onActiveChange?: (activeId: string | null) => void;
};

export default function DraggableContext({
  values,
  dragOverlayItem,
  children,
  onDragOver,
  onDragEnd,
  onActiveChange,
}: React.PropsWithChildren<DraggableContextProps>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const OverlayItem = dragOverlayItem;
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
      onDragOver={handleDragOver}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          OverlayItem ? (
            <OverlayItem>{activeId}</OverlayItem>
          ) : (
            <Item className=" shadow-lg">{activeId}</Item>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as string);
    onActiveChange?.(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeContainerId = active.data.current?.sortable.containerId;
    const ovetContainerId = over.data.current?.sortable.containerId;

    if (!activeContainerId || !ovetContainerId) return;

    if (activeContainerId !== ovetContainerId) {
      const newValues = {
        ...values,
        [ovetContainerId as string]: [...values[ovetContainerId], active.id as string],
        [activeContainerId as string]: values[activeContainerId].filter((id) => id !== active.id),
      };

      onDragOver?.(newValues);
    }
  }

  // 같은 컨텍스트 간 이동
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeContainerId = active.data.current?.sortable.containerId;
    const ovetContainerId = over.data.current?.sortable.containerId;

    if (!activeContainerId || !ovetContainerId) return;

    if (activeContainerId === ovetContainerId) {
      const value = values[activeContainerId as string];
      const oldIndex = value.indexOf(active.id as string);
      const newIndex = value.indexOf(over.id as string);

      onDragEnd({
        ...values,
        [activeContainerId]: arrayMove(value, oldIndex, newIndex),
      });
    }
    setActiveId(null);
    onActiveChange?.(null);
  }
}

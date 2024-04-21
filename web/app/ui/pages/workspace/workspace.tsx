'use client';
import IndicatorBoard from '../../components/numerical-guidance/indicator-board/indicator-board';
import ResizablePanelGroup from '../../components/view/molecule/resizable-panel-group';
import DraggableContext from '../../components/util/draggable-context';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import { SortableContext } from '@dnd-kit/sortable';
import Draggable from '../../components/view/atom/draggable/draggable';
import { useState } from 'react';
import { cn } from '@/app/utils/style';

export default function Workspace() {
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const { splitScreen, indicatorBoardInfos, reorderIndicatorBoardInfos } = useIndicatorBoard();

  const handleDragSwapWithOtherContext = (newValue: { [key: string]: string[] }) => {
    const newIndicatorBoardMetadataIds = Object.keys(newValue).map((_, index) => newValue[`${index}`][0]);
    reorderIndicatorBoardInfos(newIndicatorBoardMetadataIds);
  };

  const handleActiveChange = (activeId: string | null) => {
    setActiveDragItemId(activeId);
  };

  const draggableContextValue = indicatorBoardInfos.reduce<{
    [key: string]: string[];
  }>((acc, info, index) => {
    return {
      ...acc,
      [`${index}`]: [info.metadataId],
    };
  }, {});

  if (splitScreen === 'vertical') {
    return (
      <DraggableContext
        values={draggableContextValue}
        onActiveChange={handleActiveChange}
        onDragSwapWithOtherContext={handleDragSwapWithOtherContext}
      >
        <ResizablePanelGroup direction="horizontal">
          {Array.from({ length: 2 }, () => 0).map((_, index) => {
            const item = draggableContextValue[index];
            return (
              <>
                {item ? (
                  <ResizablePanelGroup.Panel key={index} defaultSize={50}>
                    <SortableContext id={`${index}`} items={item}>
                      <div
                        className={cn('flex h-full items-center justify-center px-2', {
                          'border-2 border-lime-300': activeDragItemId ? item[0] !== activeDragItemId : false,
                        })}
                      >
                        <Draggable active={item[0] === activeDragItemId} handle="top" id={item[0]}>
                          <IndicatorBoard indicatorBoardMetadataId={item[0]} />
                        </Draggable>
                      </div>
                    </SortableContext>
                  </ResizablePanelGroup.Panel>
                ) : (
                  <ResizablePanelGroup.Panel key={index} defaultSize={50}>
                    <div className="flex h-full items-center justify-center px-2">
                      <IndicatorBoard />
                    </div>
                  </ResizablePanelGroup.Panel>
                )}
                {index === 0 ? <ResizablePanelGroup.Handle disabled={true} /> : null}
              </>
            );
          })}
        </ResizablePanelGroup>
      </DraggableContext>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanelGroup.Panel defaultSize={100}>
        <div className="flex h-full items-center justify-center">
          <div className="w-[55rem]">
            {indicatorBoardInfos.length === 0 ? (
              <IndicatorBoard />
            ) : (
              <IndicatorBoard indicatorBoardMetadataId={indicatorBoardInfos[0].metadataId} />
            )}
          </div>
        </div>
      </ResizablePanelGroup.Panel>
    </ResizablePanelGroup>
  );
}

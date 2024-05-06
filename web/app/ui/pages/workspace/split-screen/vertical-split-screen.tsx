import EditableMetadataTittle from '@/app/ui/components/numerical-guidance/indicator-board-metadata/editable-metadata-title';
import IndicatorBoard from '@/app/ui/components/numerical-guidance/indicator-board/indicator-board';
import DraggableContext from '@/app/ui/components/util/draggable-context';
import Draggable from '@/app/ui/components/view/atom/draggable/draggable';
import ResizablePanelGroup from '@/app/ui/components/view/molecule/resizable-panel-group';
import { cn } from '@/app/utils/style';
import { SortableContext } from '@dnd-kit/sortable';
import { Card } from '@tremor/react';
import Image from 'next/image';
import ChartImage from '@/public/assets/images/chart-image.png';
import { useState } from 'react';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';

export default function VerticalSplitScreen() {
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const { indicatorBoardInfos, reorderIndicatorBoardInfos } = useIndicatorBoard();

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

  return (
    <DraggableContext
      values={draggableContextValue}
      onActiveChange={handleActiveChange}
      onDragSwapWithOtherContext={handleDragSwapWithOtherContext}
      dragOverlayItem={({ activeId }) => (
        <Card className="min-h-[32.5rem] w-full rounded-lg bg-white opacity-60 shadow-2xl">
          <div className="flex items-center justify-center">
            <EditableMetadataTittle indicatorBoardMetadataId={activeId!} />
          </div>
          <div className="mt-12 h-5 w-full px-8">
            <Image quality={75} src={ChartImage} alt="chart-image" />
          </div>
        </Card>
      )}
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

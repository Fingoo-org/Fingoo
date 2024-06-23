import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import IndicatorBoard from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board';
import Draggable from '@/app/ui/components/view/atom/draggable/draggable';
import ResizablePanelGroup from '@/app/ui/components/view/molecule/resizable-panel-group';
import { cn } from '@/app/utils/style';
import { SortableContext } from '@dnd-kit/sortable';

type HorizontalIndicatorBoardProps = {
  indexOffset: number;
};
export function HorizontalIndicatorBoard({ indexOffset }: HorizontalIndicatorBoardProps) {
  const { activeDragMetadataId, draggableIndicatorBoardContextValue } = useSplitIndicatorBoard();

  return (
    <ResizablePanelGroup direction="horizontal">
      {Array.from({ length: 2 }, () => 0).map((_, index) => {
        const item = draggableIndicatorBoardContextValue[index + indexOffset];
        const metadataId = item?.[0];
        return (
          <>
            {item ? (
              <ResizablePanelGroup.Panel key={index} defaultSize={50}>
                <SortableContext id={`${index}`} items={item}>
                  <div
                    className={cn('flex h-full items-center justify-center px-2', {
                      'border-2 border-lime-300': activeDragMetadataId ? metadataId !== activeDragMetadataId : false,
                    })}
                  >
                    <Draggable active={metadataId === activeDragMetadataId} handle="top" id={metadataId}>
                      <IndicatorBoard indicatorBoardMetadataId={metadataId} />
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
  );
}

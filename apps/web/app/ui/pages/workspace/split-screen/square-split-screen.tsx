import IndicatorBoard from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board';
import IndicatorBoardDraggableContext from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board-draggable-context';
import ResizablePanelGroup from '@/app/ui/components/view/molecule/resizable-panel-group';

export default function SquareSplitScreen() {
  return (
    <IndicatorBoardDraggableContext>
      <ResizablePanelGroup direction={'vertical'}>
        <ResizablePanelGroup.Panel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanelGroup.Panel defaultSize={50}>
              <div className="flex h-full items-center justify-center px-2">
                <IndicatorBoard />
              </div>
            </ResizablePanelGroup.Panel>
            <ResizablePanelGroup.Panel defaultSize={50}>
              <div className="flex h-full items-center justify-center px-2">
                <IndicatorBoard />
              </div>
            </ResizablePanelGroup.Panel>
          </ResizablePanelGroup>
        </ResizablePanelGroup.Panel>
        <ResizablePanelGroup.Panel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanelGroup.Panel defaultSize={50}>
              <div className="flex h-full items-center justify-center px-2">
                <IndicatorBoard />
              </div>
            </ResizablePanelGroup.Panel>
            <ResizablePanelGroup.Panel defaultSize={50}>
              <div className="flex h-full items-center justify-center px-2">
                <IndicatorBoard />
              </div>
            </ResizablePanelGroup.Panel>
          </ResizablePanelGroup>
        </ResizablePanelGroup.Panel>
      </ResizablePanelGroup>
    </IndicatorBoardDraggableContext>
  );
}

import IndicatorBoardDraggableContext from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board-draggable-context';
import ResizablePanelGroup from '@/app/ui/components/view/molecule/resizable-panel-group';
import { HorizontalIndicatorBoard } from './horizontal-indicator-board';

export default function SquareSplitScreen() {
  return (
    <IndicatorBoardDraggableContext>
      <ResizablePanelGroup direction={'vertical'}>
        <ResizablePanelGroup.Panel defaultSize={50}>
          <HorizontalIndicatorBoard indexOffset={0} />
        </ResizablePanelGroup.Panel>
        <ResizablePanelGroup.Panel defaultSize={50}>
          <HorizontalIndicatorBoard indexOffset={2} />
        </ResizablePanelGroup.Panel>
      </ResizablePanelGroup>
    </IndicatorBoardDraggableContext>
  );
}

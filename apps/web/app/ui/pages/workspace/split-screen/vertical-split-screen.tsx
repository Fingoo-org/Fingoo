import IndicatorBoardDraggableContext from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board-draggable-context';
import { HorizontalIndicatorBoard } from './horizontal-indicator-board';

export default function VerticalSplitScreen() {
  return (
    <IndicatorBoardDraggableContext>
      <HorizontalIndicatorBoard indexOffset={0} />
    </IndicatorBoardDraggableContext>
  );
}

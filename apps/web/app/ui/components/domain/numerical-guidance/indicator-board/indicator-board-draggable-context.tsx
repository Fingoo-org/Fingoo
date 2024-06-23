import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import DraggableContext from '@/app/ui/components/util/draggable-context';
import { Card } from '@/app/ui/components/view/molecule/card/card';
import EditableMetadataTittle from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/editable-metadata-title';
import Image from 'next/image';
import ChartImage from '@/public/assets/images/chart-image.png';

export default function IndicatorBoardDraggableContext({ children }: React.PropsWithChildren) {
  const { draggableIndicatorBoardContextValue, handleDragSwapWithOtherContext, handleActiveChange } =
    useSplitIndicatorBoard();

  return (
    <DraggableContext
      values={draggableIndicatorBoardContextValue}
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
      {children}
    </DraggableContext>
  );
}

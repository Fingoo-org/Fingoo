import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import IndicatorBoard from '@/app/ui/components/domain/numerical-guidance/indicator-board/indicator-board';
import ResizablePanelGroup from '@/app/ui/components/view/molecule/resizable-panel-group';

export default function FullScreen() {
  const { indicatorBoardInfos } = useIndicatorBoard();
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

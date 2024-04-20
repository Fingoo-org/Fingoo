'use client';
import IndicatorBoard from './indicator-board';
import { useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import ResizablePanelGroup from '../../components/view/molecule/resizable-panel-group';

export default function Workspace() {
  const { splitScreen } = useIndicatorBoardStore();
  const { indicatorBoardInfos } = useIndicatorBoardStore((state) => state);

  if (splitScreen === 'vertical') {
    return (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanelGroup.Panel defaultSize={50}>
          <div className="flex h-full items-center justify-center px-2">
            <IndicatorBoard indicatorBoardMetadataId={indicatorBoardInfos[0]?.metadataId} />
          </div>
        </ResizablePanelGroup.Panel>
        <ResizablePanelGroup.Handle disabled={true} />
        <ResizablePanelGroup.Panel defaultSize={50}>
          <div className="flex h-full items-center justify-center px-2">
            <IndicatorBoard indicatorBoardMetadataId={indicatorBoardInfos[1]?.metadataId} />
          </div>
        </ResizablePanelGroup.Panel>
      </ResizablePanelGroup>
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

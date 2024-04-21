'use client';
import IndicatorBoard from '../../components/numerical-guidance/indicator-board/indicator-board';
import ResizablePanelGroup from '../../components/view/molecule/resizable-panel-group';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import { useState } from 'react';
import VerticalSplitScreen from './split-screen/vertical-split-screen';

export default function Workspace() {
  const { splitScreen, indicatorBoardInfos } = useIndicatorBoard();

  if (splitScreen === 'vertical') {
    return <VerticalSplitScreen />;
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

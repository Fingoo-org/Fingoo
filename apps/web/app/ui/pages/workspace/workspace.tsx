'use client';
import VerticalSplitScreen from './split-screen/vertical-split-screen';
import FullScreen from './split-screen/full-screen';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';

export default function Workspace() {
  const { splitScreen } = useSplitIndicatorBoard();

  if (splitScreen === 'vertical') {
    return <VerticalSplitScreen />;
  }

  return <FullScreen />;
}

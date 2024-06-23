'use client';
import VerticalSplitScreen from './split-screen/vertical-split-screen';
import FullScreen from './split-screen/full-screen';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import SquareSplitScreen from './split-screen/square-split-screen';

export default function Workspace() {
  const { splitScreen } = useSplitIndicatorBoard();

  if (splitScreen === 'square') {
    return <SquareSplitScreen />;
  }

  if (splitScreen === 'vertical') {
    return <VerticalSplitScreen />;
  }

  return <FullScreen />;
}

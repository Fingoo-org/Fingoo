'use client';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import VerticalSplitScreen from './split-screen/vertical-split-screen';
import FullScreen from './split-screen/full-screen';

export default function Workspace() {
  const { splitScreen } = useIndicatorBoard();

  if (splitScreen === 'vertical') {
    return <VerticalSplitScreen />;
  }

  return <FullScreen />;
}

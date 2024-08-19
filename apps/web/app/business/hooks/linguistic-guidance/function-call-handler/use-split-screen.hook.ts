import { SplitScreen } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useSplitIndicatorBoard } from '../../numerical-guidance/indicator-board/use-split-indicator-board.hook';

export default function useSplitScreen() {
  const { transitionSplitScreen } = useSplitIndicatorBoard();
  const splitScreenHandler = (mode: SplitScreen) => {
    transitionSplitScreen(mode);
    return '화면분할완료';
  };

  return { splitScreenHandler };
}

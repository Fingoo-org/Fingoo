import { SplitScreen } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useSplitIndicatorBoard } from '../../numerical-guidance/indicator-board/use-split-indicator-board.hook';

export default function useSplitScreen() {
  const { transitionSplitScreen } = useSplitIndicatorBoard();

  const isSplitScreen = (mode: string): mode is SplitScreen => {
    const validScreens: SplitScreen[] = ['full', 'square', 'vertical'];
    return validScreens.includes(mode as SplitScreen);
  };

  const splitScreenHandler = (mode: string) => {
    if (isSplitScreen(mode)) {
      transitionSplitScreen(mode);
      return '화면분할 완료';
    } else {
      return '화면분할 실패, 재시도해주세요';
    }
  };

  return { splitScreenHandler };
}

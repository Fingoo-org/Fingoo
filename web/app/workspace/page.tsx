import IndicatorBoard from '../ui/pages/workspace/indicator-board';
import SplitScreenToggleGroup from '../ui/components/numerical-guidance/indicator-board/split-screen-toggle-group';

export default function Page() {
  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 rounded-lg bg-white">
        <SplitScreenToggleGroup />
      </div>
      <div className="flex h-full items-center justify-center">
        <IndicatorBoard />
      </div>
    </>
  );
}

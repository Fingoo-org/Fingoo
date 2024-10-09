import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import { BaseIntervalToggleGroup } from '../indicator/base-interval-toggle-group';
import { Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';

type IntervalToggleGroupProps = {
  indicatorBoardMetadataId?: string;
};

export default function IntervalToggleGroup({ indicatorBoardMetadataId }: IntervalToggleGroupProps) {
  const { interval, setInterval } = useIndicatorBoard(indicatorBoardMetadataId);
  const { splitScreen } = useSplitIndicatorBoard();

  const handleIntervalChange = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  return (
    <BaseIntervalToggleGroup
      interval={interval}
      onChange={handleIntervalChange}
      disabled={!indicatorBoardMetadataId}
      splitScreen={splitScreen}
    />
  );
}

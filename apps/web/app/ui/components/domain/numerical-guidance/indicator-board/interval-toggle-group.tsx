import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import { BaseIntervalToggleGroup } from './base-interval-toggle-group';

type IntervalToggleGroupProps = {
  indicatorBoardMetadataId?: string;
};

export default function IntervalToggleGroup({ indicatorBoardMetadataId }: IntervalToggleGroupProps) {
  const { interval, setInterval } = useIndicatorBoard(indicatorBoardMetadataId);
  const { splitScreen } = useSplitIndicatorBoard();

  return (
    <BaseIntervalToggleGroup
      interval={interval}
      setInterval={setInterval}
      disabled={!indicatorBoardMetadataId}
      splitScreen={splitScreen}
    />
  );
}

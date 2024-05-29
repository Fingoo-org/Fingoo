import ToggleGroup from '../../../view/molecule/toggle-group';
import { intervals, type Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

type IntervalToggleGroup = {
  indicatorBoardMetadataId?: string;
};

export default function IntervalToggleGroup({ indicatorBoardMetadataId }: IntervalToggleGroup) {
  // TODO: 수정 필요
  const { interval, setInterval } = useIndicatorBoard(indicatorBoardMetadataId);

  const handleIntervalChange = (value: string) => {
    if (isInterval(value)) {
      setInterval(value);
    }
  };

  return (
    <ToggleGroup
      disabled={indicatorBoardMetadataId ? false : true}
      value={interval}
      onValueChange={handleIntervalChange}
      type="single"
    >
      <ToggleGroup.Item value="day">
        <div className="w-20">Day</div>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="week">
        <div className="w-20">Week</div>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="month">
        <div className="w-20">Month</div>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="year">
        <div className="w-20">Year</div>
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}

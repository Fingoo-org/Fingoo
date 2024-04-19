import ToggleGroup from '../../view/molecule/toggle-group';
import { intervals, type Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

export default function IntervalToggleGroup() {
  const { interval, setInterval } = useIndicatorBoard();

  const handleIntervalChange = (value: string) => {
    if (isInterval(value)) {
      setInterval(value);
    }
  };

  return (
    <ToggleGroup value={interval} onValueChange={handleIntervalChange} type="single">
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

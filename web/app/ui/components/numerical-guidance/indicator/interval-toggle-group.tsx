import ToggleGroup from '../../view/molocule/toggle-group';
import { intervals, useNumericalGuidanceStore, type Interval } from '@/app/store/stores/numerical-guidance.store';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

export default function IntervalToggleGroup() {
  const interval = useNumericalGuidanceStore((state) => state.interval);
  const { setInterval } = useNumericalGuidanceStore((state) => state.actions);

  const handleIntervalChange = (value: string) => {
    if (isInterval(value)) {
      setInterval(value);
    }
    console.log(value);
  };

  return (
    <ToggleGroup defaultValue={interval} onValueChange={handleIntervalChange} type="single">
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

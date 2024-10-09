import ToggleGroup from '../../../view/molecule/toggle-group';
import { intervals, type Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { cn } from '@/app/utils/style';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

export interface BaseIntervalToggleGroupProps {
  interval: Interval;
  setInterval: (interval: Interval) => void;
  disabled?: boolean;
  splitScreen?: 'square' | string;
}

export function BaseIntervalToggleGroup({
  interval,
  setInterval,
  disabled = false,
  splitScreen,
}: BaseIntervalToggleGroupProps) {
  const handleIntervalChange = (value: string) => {
    if (isInterval(value)) {
      setInterval(value);
    }
  };

  return (
    <ToggleGroup disabled={disabled} value={interval} onValueChange={handleIntervalChange} type="single">
      <ToggleGroup.Item value="day">
        <Item splitScreen={splitScreen}>Day</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="week">
        <Item splitScreen={splitScreen}>Week</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="month">
        <Item splitScreen={splitScreen}>Month</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="year">
        <Item splitScreen={splitScreen}>Year</Item>
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}

function Item({ children, splitScreen }: React.PropsWithChildren<{ splitScreen?: string }>) {
  return (
    <div
      className={cn({
        'w-20': !splitScreen || splitScreen !== 'square',
        'w-10 text-xs': splitScreen === 'square',
      })}
    >
      {children}
    </div>
  );
}

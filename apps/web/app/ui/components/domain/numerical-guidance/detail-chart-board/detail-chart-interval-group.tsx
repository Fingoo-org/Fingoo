import ToggleGroup from '../../../view/molecule/toggle-group';
import { intervals, type Interval } from '@/app/store/stores/numerical-guidance/detail-board.store';
import { useDetailBoardStore } from '@/app/store/stores/numerical-guidance/detail-board.store';
import { cn } from '@/app/utils/style';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

export default function DetailChartIntervalGroup() {
  const { interval } = useDetailBoardStore();
  const { setInterval } = useDetailBoardStore((state) => state.actions);

  const handleIntervalChange = (value: string) => {
    if (isInterval(value)) {
      setInterval(value);
    }
  };

  return (
    <ToggleGroup value={interval} onValueChange={handleIntervalChange} type="single" className="w-full">
      <ToggleGroup.Item value="day">
        <Item>Day</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="week">
        <Item>Week</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="month">
        <Item>Month</Item>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="year">
        <Item>Year</Item>
      </ToggleGroup.Item>
    </ToggleGroup>
  );

  function Item({ children }: React.PropsWithChildren) {
    return <div className={cn('w-20 text-center sm:w-14 md:w-16 lg:w-20 xl:w-24')}>{children}</div>;
  }
}

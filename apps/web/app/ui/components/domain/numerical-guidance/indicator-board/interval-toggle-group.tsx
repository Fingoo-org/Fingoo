import ToggleGroup from '../../../view/molecule/toggle-group';
import { intervals, SplitScreen, type Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import { cn } from '@/app/utils/style';

function isInterval(value: string): value is Interval {
  return intervals.includes(value as Interval);
}

type IntervalToggleGroup = {
  indicatorBoardMetadataId?: string;
};

export default function IntervalToggleGroup({ indicatorBoardMetadataId }: IntervalToggleGroup) {
  const { interval, setInterval } = useIndicatorBoard(indicatorBoardMetadataId);
  const { splitScreen } = useSplitIndicatorBoard();

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
      <ToggleGroup.Item  value="day">
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
    return (
      <div
        className={cn({
          'w-20': splitScreen !== 'square',
          'w-10 text-xs': splitScreen === 'square',
        })}
      >
        {children}
      </div>
    );
  }
}

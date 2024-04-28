import { useIndicatorBoard } from '@/app/business/hooks/indicator-board/use-indicator-board.hook';
import ToggleGroup from '../../view/molecule/toggle-group';
import { DateRange, dateRange } from '@/app/store/stores/numerical-guidance/indicator-board.store';

type DateRangeNavigatorProps = {
  indicatorBoardMetadataId?: string;
};

function isDateRange(value: string): value is DateRange {
  return dateRange.includes(value as DateRange);
}

export default function DateRangeNavigator({ indicatorBoardMetadataId }: DateRangeNavigatorProps) {
  const { dateRange, updateDateRange } = useIndicatorBoard(indicatorBoardMetadataId);

  const handleDateRangeChange = (value: string) => {
    if (isDateRange(value)) {
      updateDateRange(value);
    } else {
      updateDateRange('default');
    }
  };

  return (
    <ToggleGroup onValueChange={handleDateRangeChange} value={dateRange} type={'single'} size={'xs'}>
      <ToggleGroup.Item value="1Y">1Y</ToggleGroup.Item>
      <ToggleGroup.Item value="5Y">5Y</ToggleGroup.Item>
      <ToggleGroup.Item value="10Y">10Y</ToggleGroup.Item>
      <ToggleGroup.Item value="MAX">MAX</ToggleGroup.Item>
    </ToggleGroup>
  );
}

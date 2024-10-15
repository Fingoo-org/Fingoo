import { IndicatorType, indicatorTypes } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import ToggleGroup from './toggle-group';
import { cn } from '@/app/utils/style';

type IndicatorTypeToggleGroupProps = {
  value: string;
  onValueChange: (value: IndicatorType) => void;
  size: 'narrow' | 'wide';
  fullWidth?: boolean;
};

function isIndicatorType(value: string): value is IndicatorType {
  return indicatorTypes.includes(value as IndicatorType);
}

export default function IndicatorTypeToggleGroup({
  value,
  size,
  onValueChange,
  fullWidth = false,
}: IndicatorTypeToggleGroupProps) {
  const handleIndicatorTypeChange = (indicatorType: IndicatorType) => {
    if (isIndicatorType(indicatorType)) {
      onValueChange(indicatorType);
    }
  };

  return (
    <ToggleGroup
      value={value}
      onValueChange={handleIndicatorTypeChange}
      type="single"
      size={size}
      className={cn(fullWidth && 'w-full')}
    >
      <ToggleGroup.Item value="stocks" className={cn(fullWidth && 'flex-1')}>
        주식
      </ToggleGroup.Item>
      <ToggleGroup.Item value="funds" className={cn(fullWidth && 'flex-1')}>
        펀드
      </ToggleGroup.Item>
      <ToggleGroup.Item value="forex_pairs" className={cn(fullWidth && 'flex-1')}>
        외환
      </ToggleGroup.Item>
      <ToggleGroup.Item value="cryptocurrencies" className={cn(fullWidth && 'flex-1')}>
        크립토
      </ToggleGroup.Item>
      <ToggleGroup.Item value="indices" className={cn(fullWidth && 'flex-1')}>
        지수
      </ToggleGroup.Item>
      <ToggleGroup.Item value="bonds" className={cn(fullWidth && 'flex-1')}>
        채권
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}

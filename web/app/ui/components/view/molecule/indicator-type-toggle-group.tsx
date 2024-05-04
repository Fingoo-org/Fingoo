import { IndicatorType, indicatorTypes } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import ToggleGroup from './toggle-group';

type IndicatorTypeToggleGroupProps = {
  value: string;
  onValueChange: (value: IndicatorType) => void;
  size: 'wide';
};

function isIndicatorType(value: string): value is IndicatorType {
  return indicatorTypes.includes(value as IndicatorType);
}

export default function IndicatorTypeToggleGroup({ value, onValueChange }: IndicatorTypeToggleGroupProps) {
  const handleIndicatorTypeChange = (indicatorType: IndicatorType) => {
    if (isIndicatorType(indicatorType)) {
      onValueChange(indicatorType);
    }
  };

  return (
    <ToggleGroup value={value} onValueChange={handleIndicatorTypeChange} type="single" size={'wide'}>
      <ToggleGroup.Item value="stocks">주식</ToggleGroup.Item>
      <ToggleGroup.Item value="funds">펀드</ToggleGroup.Item>
      <ToggleGroup.Item value="forex_pairs">외환</ToggleGroup.Item>
      <ToggleGroup.Item value="cryptocurrencies">크립토</ToggleGroup.Item>
      <ToggleGroup.Item value="indices">지수</ToggleGroup.Item>
      <ToggleGroup.Item value="bonds">채권</ToggleGroup.Item>
    </ToggleGroup>
  );
}

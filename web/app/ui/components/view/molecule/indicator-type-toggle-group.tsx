import ToggleGroup from './toggle-group';

type IndicatorTypeToggleGroupProps = {
  value: string;
  onValueChange: (value: string) => void;
  size: 'wide';
};

export default function IndicatorTypeToggleGroup({ value, onValueChange }: IndicatorTypeToggleGroupProps) {
  return (
    <ToggleGroup value={value} onValueChange={onValueChange} type="single" size={'wide'}>
      <ToggleGroup.Item value="stocks">주식</ToggleGroup.Item>
      <ToggleGroup.Item value="funds">펀드</ToggleGroup.Item>
      <ToggleGroup.Item value="forex_pairs">외환</ToggleGroup.Item>
      <ToggleGroup.Item value="cryptocurrencies">크립토</ToggleGroup.Item>
      <ToggleGroup.Item value="indices">지수</ToggleGroup.Item>
      <ToggleGroup.Item value="bonds">채권</ToggleGroup.Item>
    </ToggleGroup>
  );
}

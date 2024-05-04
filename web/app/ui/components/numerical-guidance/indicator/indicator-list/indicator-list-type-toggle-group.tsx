import ToggleGroup from '../../../view/molecule/toggle-group';
import {
  IndicatorType,
  indicatorTypes,
  useIndicatorListStore,
} from '@/app/store/stores/numerical-guidance/indicator-list.store';

function isIndicatorType(value: string): value is IndicatorType {
  return indicatorTypes.includes(value as IndicatorType);
}

export default function IndicatorListTypeToggleGroup() {
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);
  const { selectIndicatorType } = useIndicatorListStore((state) => state.actions);

  const handleIndicatorTypeChange = (indicatorType: string) => {
    if (isIndicatorType(indicatorType)) {
      selectIndicatorType(indicatorType);
    }
  };

  return (
    <ToggleGroup value={selectedIndicatorType} onValueChange={handleIndicatorTypeChange} type="single" size={'wide'}>
      <ToggleGroup.Item value="stocks">주식</ToggleGroup.Item>
      <ToggleGroup.Item value="funds">펀드</ToggleGroup.Item>
      <ToggleGroup.Item value="forex_pairs">외환</ToggleGroup.Item>
      <ToggleGroup.Item value="cryptocurrencies">크립토</ToggleGroup.Item>
      <ToggleGroup.Item value="indices">지수</ToggleGroup.Item>
      <ToggleGroup.Item value="bonds">채권</ToggleGroup.Item>
    </ToggleGroup>
  );
}

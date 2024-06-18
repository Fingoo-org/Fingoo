import IndicatorTypeToggleGroup from '../../../../view/molecule/indicator-type-toggle-group';
import ToggleGroup from '../../../../view/molecule/toggle-group';
import {
  IndicatorType,
  indicatorTypes,
  useIndicatorListStore,
} from '@/app/store/stores/numerical-guidance/indicator-list.store';

export default function IndicatorListTypeToggleGroup() {
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);
  const { selectIndicatorType } = useIndicatorListStore((state) => state.actions);

  const handleIndicatorTypeChange = (indicatorType: IndicatorType) => {
    selectIndicatorType(indicatorType);
  };

  return (
    <IndicatorTypeToggleGroup value={selectedIndicatorType} onValueChange={handleIndicatorTypeChange} size={'wide'} />
  );
}

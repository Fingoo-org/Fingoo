import { useFetchIndicatorListByType } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { useIndicatorListStore } from '@/app/store/stores/numerical-guidance/indicator-list.store';

export default function IndicatorListResult() {
  const selectedIndicatorType = useIndicatorListStore((state) => state.selectedIndicatorType);
  const { data } = useFetchIndicatorListByType(selectedIndicatorType);

  console.log(data);

  return <div></div>;
}

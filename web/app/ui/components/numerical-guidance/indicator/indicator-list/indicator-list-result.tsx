import { useIndicatorListByType } from '@/app/business/hooks/indicator/use-indicator-list-by-type.hook';

export default function IndicatorListResult() {
  const { indicatorList } = useIndicatorListByType();

  console.log(indicatorList);

  return <div></div>;
}

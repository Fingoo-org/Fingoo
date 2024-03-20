import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { Card } from '@tremor/react';
import Slider from '../../view/atom/slider/slider';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';

type SourceIndicatorSliderProps = {
  item: IndicatorInfoResponse & { weight: number };
};

export default function SourceIndicatorSlider({ item }: SourceIndicatorSliderProps) {
  const { updateSourceIndicatorWeight } = useSelectedCustomForecastIndicatorViewModel();

  const handleSourceIndicatorWeightChange = (value: number[]) => {
    updateSourceIndicatorWeight(item.id, value[0]);
  };

  return (
    <Card className="flex space-x-6 rounded-lg px-1 py-2">
      <div className="text-xs">{item.ticker}</div>
      <Slider onValueChange={handleSourceIndicatorWeightChange} value={[item.weight]} key={item.id} />
    </Card>
  );
}

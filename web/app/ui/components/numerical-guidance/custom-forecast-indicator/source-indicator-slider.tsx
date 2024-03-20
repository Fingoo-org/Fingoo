import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { Card } from '@tremor/react';
import Slider from '../../view/atom/slider/slider';

type SourceIndicatorSliderProps = {
  item: IndicatorInfoResponse & { weight: number };
};

export default function SourceIndicatorSlider({ item }: SourceIndicatorSliderProps) {
  return (
    <Card className="flex space-x-6 rounded-lg px-1 py-2">
      <div className="text-xs">{item.ticker}</div>
      <Slider defaultValue={[item.weight]} key={item.id} />
    </Card>
  );
}

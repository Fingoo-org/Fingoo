import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { Card } from '@tremor/react';
import Slider from '../../view/atom/slider/slider';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import IconButton from '../../view/atom/icons/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';

type SourceIndicatorInfo = {
  weight: number;
  disabled: boolean;
  id: string;
  ticker: string;
  name: string;
};

type SourceIndicatorSliderProps = {
  item: SourceIndicatorInfo;
};

export default function SourceIndicatorSlider({ item }: SourceIndicatorSliderProps) {
  const { updateSourceIndicatorWeight } = useSelectedCustomForecastIndicatorViewModel();

  const handleSourceIndicatorWeightChange = (value: number[]) => {
    updateSourceIndicatorWeight(item.id, value[0]);
  };

  const handleSourceIndicatorDelete = () => {};

  return (
    <Card className="flex items-center rounded-lg px-1 py-1">
      <div className="mr-2 block w-16 truncate text-xs">{item.ticker}</div>
      {item.disabled ? (
        <div className="grow">Disabled</div>
      ) : (
        <Slider onValueChange={handleSourceIndicatorWeightChange} value={[item.weight]} key={item.id} />
      )}
      <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleSourceIndicatorDelete} />
    </Card>
  );
}

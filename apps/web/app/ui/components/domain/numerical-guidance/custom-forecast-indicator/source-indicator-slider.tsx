import Slider from '../../../view/atom/slider/slider';
import IconButton from '../../../view/atom/icons/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { Card } from '../../../view/molecule/card/card';

export type SourceIndicatorInfo = {
  weight: number;
  disabled?: boolean;
  id: string;
  indicatorType: IndicatorType;
  symbol: string;
};

type SourceIndicatorSliderProps = {
  item: SourceIndicatorInfo;
  onWeightChange: (item: SourceIndicatorInfo, value: number) => void;
  onSourceIndicatorDelete: (item: SourceIndicatorInfo) => void;
};

export default function SourceIndicatorSlider({
  item,
  onWeightChange,
  onSourceIndicatorDelete,
}: SourceIndicatorSliderProps) {
  const handleSourceIndicatorWeightChange = (value: number[]) => {
    onWeightChange(item, value[0]);
  };

  const handleSourceIndicatorDelete = () => {
    onSourceIndicatorDelete(item);
  };

  return (
    <Card className="flex items-center rounded-lg px-1 py-1">
      <div className="mr-2 block w-16 truncate text-xs">{item.symbol}</div>
      {item.disabled ? (
        <div className="grow">Disabled</div>
      ) : (
        <Slider
          min={-50}
          max={50}
          onValueChange={handleSourceIndicatorWeightChange}
          value={[item.weight]}
          key={item.id}
        />
      )}
      <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleSourceIndicatorDelete} />
    </Card>
  );
}

import Slider from '../../../view/atom/slider/slider';
import IconButton from '../../../view/atom/icons/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { Card } from '../../../view/molecule/card/card';
import { cn } from '@/app/utils/style';

export type SourceIndicatorInfo = {
  weight: number;
  disabled?: boolean;
  id: string;
  indicatorType: IndicatorType;
  symbol: string;
};

type SourceIndicatorSliderProps = {
  item: SourceIndicatorInfo;
  color?: string;

  onWeightChange: (item: SourceIndicatorInfo, value: number) => void;
  onSourceIndicatorDelete: (item: SourceIndicatorInfo) => void;
};

export default function SourceIndicatorSlider({
  item,
  color = 'blue',
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
      <div className="mx-1 block w-12 truncate  text-xs">{item.symbol}</div>
      {color ? <div className={cn(`mr-2 h-4 w-4  rounded-sm`, `bg-${color}`)} /> : null}
      {item.disabled ? (
        <div className="grow">Disabled</div>
      ) : (
        <div className="flex grow items-center">
          <Slider
            min={-50}
            max={50}
            onValueChange={handleSourceIndicatorWeightChange}
            value={[item.weight]}
            key={item.id}
          />
          <div className="px-1 text-xs">{item.weight}</div>
        </div>
      )}
      <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleSourceIndicatorDelete} />
    </Card>
  );
}

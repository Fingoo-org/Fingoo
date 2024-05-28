import DialogMenu from '@/app/ui/components/view/molecule/dialog-menu';
import DialogIndicatorList from '../../../indicator/dialog-indicator-list/dialog-indicator-list';
import { Card } from '@/app/ui/components/view/molecule/card/card';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import SelectableItem from '@/app/ui/components/view/atom/selectable-item';
import { ListChildComponentProps } from 'react-window';
import { useCreateCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/custom-forecast-indicator/create-custom-foreacst-indicator.store';

export default function SelectTargetIndicatorStepDialogMenu() {
  const targetIndicatorId = useCreateCustomForecastIndicatorStore((state) => state.targetIndicatorId);
  const { setState } = useCreateCustomForecastIndicatorStore((state) => state.actions);

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    const handleItemSelected = () => {
      setState({
        targetIndicatorId: indicator.id,
        targetIndicatorType: indicator.indicatorType,
      });
    };

    const handleItemDeSelected = () => {
      setState({
        targetIndicatorId: undefined,
        targetIndicatorType: undefined,
      });
    };

    return (
      <SelectableItem
        onDeSelect={handleItemDeSelected}
        onSelect={handleItemSelected}
        selected={indicator.id === targetIndicatorId}
        style={style}
      >
        <div className="flex h-full w-full items-center text-xs font-normal">
          <span>{indicator.symbol}</span>
          <span className="truncate">({indicator.name})</span>
        </div>
      </SelectableItem>
    );
  };
  return (
    <>
      <DialogMenu.Content>
        <div className="py-1 text-xs font-bold">1. 예측하고 싶은 지표를 선택하세요.</div>
        <Card className="p-1.5">
          <DialogIndicatorList render={render} />
        </Card>
      </DialogMenu.Content>
    </>
  );
}

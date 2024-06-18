import DialogMenu from '@/app/ui/components/view/molecule/dialog-menu';
import DialogIndicatorList from '../../../indicator/dialog-indicator-list/dialog-indicator-list';
import { Card } from '@/app/ui/components/view/molecule/card/card';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import SelectableItem from '@/app/ui/components/view/atom/selectable-item';
import { ListChildComponentProps } from 'react-window';
import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import Button from '@/app/ui/components/view/atom/button/button';

type SelectTargetIndicatorStepDialogMenuProps = {
  nextStep: () => void;
};

export default function SelectTargetIndicatorStepDialogMenu({ nextStep }: SelectTargetIndicatorStepDialogMenuProps) {
  const { targetIndicatorId, selectTargetIndicator, deselectTargetIndicator } = useCreatingCustomForecastIndicator();

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    const handleItemSelected = () => {
      selectTargetIndicator(indicator);
    };

    const handleItemDeSelected = () => {
      deselectTargetIndicator();
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
        <div className="mb-3 p-1 text-xs font-bold">1. 예측하고 싶은 지표를 선택하세요.</div>
        <Card className="p-1.5">
          <DialogIndicatorList render={render} />
        </Card>
        <div className="flex items-center justify-end pt-3">
          <Button
            disabled={targetIndicatorId === undefined ? true : false}
            onClick={() => nextStep()}
            color={'black'}
            size={'xs'}
          >
            다음
          </Button>
        </div>
      </DialogMenu.Content>
    </>
  );
}

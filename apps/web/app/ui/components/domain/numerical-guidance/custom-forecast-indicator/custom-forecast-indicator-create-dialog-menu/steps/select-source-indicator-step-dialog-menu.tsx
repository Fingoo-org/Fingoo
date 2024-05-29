import { Card } from '@/app/ui/components/view/molecule/card/card';
import DialogMenu from '@/app/ui/components/view/molecule/dialog-menu';
import DialogIndicatorList from '../../../indicator/dialog-indicator-list/dialog-indicator-list';
import { ListChildComponentProps } from 'react-window';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import SelectableItem from '@/app/ui/components/view/atom/selectable-item';
import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import SourceIndicatorCreateSliderGroup from '../source-indicator-create-slider-group';
import Button from '@/app/ui/components/view/atom/button/button';
import { useDialog } from '@/app/ui/components/view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';

type SelectSourceIndicatorStepDialogMenuProps = {
  prevStep: () => void;
};

export default function SelectSourceIndicatorStepDialogMenu({ prevStep }: SelectSourceIndicatorStepDialogMenuProps) {
  const {
    targetIndicatorId,
    isCreating,
    addSourceIndicator,
    deleteSourceIndicator,
    includeSourceIndicator,
    craeteCustomForecastIndicator,
    initialize,
  } = useCreatingCustomForecastIndicator();

  const { closeDialog } = useDialog(DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU);

  const handleCustomForecastIndicatorCreate = async () => {
    await craeteCustomForecastIndicator();
    closeDialog();
    initialize();
    prevStep();
  };

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    const handleItemSelected = () => {
      addSourceIndicator(indicator);
    };

    const handleItemDeSelected = () => {
      deleteSourceIndicator(indicator.id);
    };

    return (
      <SelectableItem
        onDeSelect={handleItemDeSelected}
        onSelect={handleItemSelected}
        selected={includeSourceIndicator(indicator.id)}
        style={style}
        disabled={indicator.id === targetIndicatorId}
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
        <div className="py-1 text-xs font-bold">재료 지표 선택</div>
        <Card className="p-1.5">
          <DialogIndicatorList render={render} />
        </Card>
      </DialogMenu.Content>
      <DialogMenu.Content>
        <div className="py-1 text-xs font-bold">가중치</div>
        <SourceIndicatorCreateSliderGroup />
      </DialogMenu.Content>
      <DialogMenu.Content>
        <div className="flex items-center justify-end space-x-1">
          <Button onClick={() => prevStep()} color={'gray'} size={'xs'}>
            이전
          </Button>
          <Button
            disabled={targetIndicatorId === undefined ? true : false}
            onClick={handleCustomForecastIndicatorCreate}
            color={'black'}
            size={'xs'}
            isLoading={isCreating}
          >
            생성
          </Button>
        </div>
      </DialogMenu.Content>
    </>
  );
}

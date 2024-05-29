import { Card } from '@/app/ui/components/view/molecule/card/card';
import DialogMenu from '@/app/ui/components/view/molecule/dialog-menu';
import DialogIndicatorList from '../../../indicator/dialog-indicator-list/dialog-indicator-list';
import { ListChildComponentProps } from 'react-window';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import SelectableItem from '@/app/ui/components/view/atom/selectable-item';
import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import SourceIndicatorSlider, { SourceIndicatorInfo } from '../../source-indicator-slider';

export default function SelectSourceIndicatorStepDialogMenu() {
  const {
    sourceIndicators,
    addSourceIndicator,
    deleteSourceIndicator,
    includeSourceIndicator,
    updateSourceIndicatorWeight,
  } = useCreatingCustomForecastIndicator();

  const handleSourceIndicatorWeightChange = (item: SourceIndicatorInfo, value: number) => {
    updateSourceIndicatorWeight(item.id, value);
  };

  const handleSourceIndicatorDelete = (item: SourceIndicatorInfo) => {
    deleteSourceIndicator(item.id);
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
        {sourceIndicators.map((sourceIndicator) => {
          return (
            <SourceIndicatorSlider
              item={{
                id: sourceIndicator.sourceIndicatorId,
                ...sourceIndicator,
              }}
              onWeightChange={handleSourceIndicatorWeightChange}
              onSourceIndicatorDelete={handleSourceIndicatorDelete}
            />
          );
        })}
      </DialogMenu.Content>
    </>
  );
}

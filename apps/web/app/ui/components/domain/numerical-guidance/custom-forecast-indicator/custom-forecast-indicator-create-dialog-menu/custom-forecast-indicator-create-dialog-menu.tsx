'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../../view/molecule/dialog-menu';
import DialogIndicatorList from '../../indicator/dialog-indicator-list/dialog-indicator-list';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { ListChildComponentProps } from 'react-window';
import { Card } from '@/app/ui/components/view/molecule/card/card';
import SelectableItem from '@/app/ui/components/view/atom/selectable-item';
import { useState } from 'react';

export default function CustomForecastIndicatorCreateDialogMenu() {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    const handleItemSelected = () => {
      setSelectedIndicatorId(indicator.id);
    };

    const handleItemDeSelected = () => {
      setSelectedIndicatorId(null);
    };

    return (
      <SelectableItem
        onDeSelect={handleItemDeSelected}
        onSelect={handleItemSelected}
        selected={indicator.id === selectedIndicatorId}
        style={style}
      >
        <div className="flex text-xs font-normal">
          <span>{indicator.symbol}</span>
          <span className="truncate">({indicator.name})</span>
        </div>
      </SelectableItem>
    );
  };

  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_CREATE_MENU}>
      <DialogMenu.Header>
        <div className="py-1 text-xs font-bold">1. 예측하고 싶은 지표를 선택하세요.</div>
      </DialogMenu.Header>
      <DialogMenu.Content>
        <Card className="p-1.5">
          <DialogIndicatorList render={render} />
        </Card>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

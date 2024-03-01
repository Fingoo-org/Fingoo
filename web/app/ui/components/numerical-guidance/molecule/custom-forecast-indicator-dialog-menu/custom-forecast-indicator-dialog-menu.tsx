import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import DialogMenu from '../../../view/molocule/dialog-menu';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import SourceIndicatorSearchList from '../source-indicator-search-list';
import { Card } from '@tremor/react';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import SourceIndicatorBadgeGroup from '../source-indicator-badge-group';

export default function CustomForecastIndicatorDialogMenu() {
  const { selectedCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();

  console.log(selectedCustomForecastIndicator);
  const handleCustomForecastIndicatorNameChange = (name: string) => {
    // logic: 예측 지표 이름 변경
    console.log(name);
  };

  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput
          defaultValue={selectedCustomForecastIndicator ? selectedCustomForecastIndicator.name : ''}
          withResetButton={true}
          withDebounce={500}
          onValueChange={handleCustomForecastIndicatorNameChange}
          color={'white'}
        />
      </DialogMenu.Header>
      <DialogMenu.Content>
        <SourceIndicatorBadgeGroup />
      </DialogMenu.Content>
      <DialogMenu.Content>
        <Card className="h-28 p-1.5">
          <SourceIndicatorSearchList />
        </Card>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

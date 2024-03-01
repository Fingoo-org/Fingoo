import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import DialogMenu from '../../../view/molocule/dialog-menu';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import IndicatorSearchList from '../indicator-search-list';
import { Card } from '@tremor/react';
import { useCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-view-model';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';

export default function CustomForecastIndicatorDialogMenu() {
  const selectedCustomForecastIndicatorId = useNumericalGuidanceStore(
    (state) => state.selectedCustomForecastIndicatorId,
  );
  const { customForecastIndicator } = useCustomForecastIndicatorViewModel(selectedCustomForecastIndicatorId);

  console.log(customForecastIndicator);
  const handleCustomForecastIndicatorNameChange = (name: string) => {
    // logic: 예측 지표 이름 변경
    console.log(name);
  };

  return (
    <DialogMenu color={'gray'} size={'xl'} dialogKey={DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput
          defaultValue={customForecastIndicator ? customForecastIndicator.name : ''}
          withResetButton={true}
          withDebounce={500}
          onValueChange={handleCustomForecastIndicatorNameChange}
          color={'white'}
        />
      </DialogMenu.Header>
      <DialogMenu.Content>
        <Card className="h-28 p-1.5">
          <IndicatorSearchList />
        </Card>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

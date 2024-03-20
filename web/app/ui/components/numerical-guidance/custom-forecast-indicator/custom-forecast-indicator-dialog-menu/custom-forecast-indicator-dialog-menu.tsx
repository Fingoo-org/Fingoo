'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../../view/molocule/dialog-menu';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import SourceIndicatorSearchList from '../source-indicator-search-list';
import { Card } from '@tremor/react';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import SourceIndicatorSliderGroup from '../source-indicator-slider-group';
import Button from '../../../view/atom/button/button';
import Pending from '../../../view/molocule/pending';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function CustomForecastIndicatorDialogMenu() {
  const { selectedCustomForecastIndicator, isUpdated, isPending, applyUpdatedSourceIndicator } =
    useSelectedCustomForecastIndicatorViewModel();

  const handleCustomForecastIndicatorNameChange = (name: string) => {
    // logic: 예측 지표 이름 변경
    console.log(name);
  };

  const handleCustomForecastIndicatorApply = () => {
    applyUpdatedSourceIndicator();
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
        <Pending isPending={isPending}>
          <Card className="h-28 p-1.5">
            <SourceIndicatorSearchList />
          </Card>
          <div className="text-xs font-bold	">가중치</div>
          <SourceIndicatorSliderGroup />
        </Pending>
      </DialogMenu.Content>
      <DialogMenu.Content>
        <div className="flex flex-row-reverse gap-1">
          <Button
            onClick={handleCustomForecastIndicatorApply}
            disabled={!isUpdated || isPending}
            color={isUpdated ? 'black' : 'gray'}
            size={'xs'}
          >
            {isPending ? <ReloadIcon className="mr-1 h-3 w-3 animate-spin" /> : null}
            적용
          </Button>
        </div>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

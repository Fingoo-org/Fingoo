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
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { use } from 'react';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';

export default function CustomForecastIndicatorDialogMenu() {
  const {
    selectedCustomForecastIndicator,
    isUpdated,
    isPending,
    applyUpdatedSourceIndicator,
    updateCustomForecastIndicatorName,
  } = useSelectedCustomForecastIndicatorViewModel();
  const { deleteIndicatorBoardMetadata } = useCustomForecastIndicatorListViewModel();
  const { closeDialog } = useDialog(DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU);

  const handleCustomForecastIndicatorNameChange = (name: string) => {
    // logic: 예측 지표 이름 변경
    updateCustomForecastIndicatorName(name);
  };

  const handleCustomForecastIndicatorApply = () => {
    applyUpdatedSourceIndicator();
  };

  const handleCustomForecastIndicatorDelete = () => {
    closeDialog();
    deleteIndicatorBoardMetadata(selectedCustomForecastIndicator.id);
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
          <div className="py-2 text-xs font-bold">가중치</div>
          <SourceIndicatorSliderGroup />
        </Pending>
      </DialogMenu.Content>
      <DialogMenu.Content>
        <div className="flex flex-row-reverse gap-1">
          <Button
            aria-label="apply"
            onClick={handleCustomForecastIndicatorApply}
            disabled={!isUpdated || isPending}
            color={isUpdated ? 'black' : 'gray'}
            size={'xs'}
          >
            {isPending ? <ReloadIcon className="mr-1 h-3 w-3 animate-spin" /> : null}
            적용
          </Button>
          <Button aria-label="delete" color={'red'} onClick={handleCustomForecastIndicatorDelete} size={'xs'}>
            삭제
          </Button>
        </div>
      </DialogMenu.Content>
    </DialogMenu>
  );
}

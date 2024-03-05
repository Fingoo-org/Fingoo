'use client';

import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../view/molocule/dialog-menu';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';

export default function IndicatorDialogMenu() {
  const payload = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU).payload as IndicatorInfoResponse;
  const { createCustomForecastIndicator } = useCustomForecastIndicatorListViewModel();
  const { transitionToCustomForecastTab } = useIndicatorBoard();

  const handleCustomForecastIndicatorCreate = async () => {
    transitionToCustomForecastTab();

    await createCustomForecastIndicator(payload.id);
  };

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.INDICATOR_EDIT_MENU}>
      <DialogMenu.Item
        aria-label="create-custom-forecast-indicator"
        onClick={handleCustomForecastIndicatorCreate}
        icon={PlusCircleIcon}
      >
        예측 지표 생성
      </DialogMenu.Item>
    </DialogMenu>
  );
}

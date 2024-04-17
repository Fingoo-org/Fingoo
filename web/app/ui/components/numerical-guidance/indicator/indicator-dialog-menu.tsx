'use client';

import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../view/molecule/dialog-menu';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export default function IndicatorDialogMenu() {
  const payload = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU).payload as IndicatorInfoResponse;
  const { createCustomForecastIndicator } = useCustomForecastIndicatorListViewModel();
  const { transitionToCustomForecastTab } = useIndicatorBoard();
  const { addCustomForecastIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();

  const handleCustomForecastIndicatorCreate = async () => {
    transitionToCustomForecastTab();

    const customForecastIndicatorId = await createCustomForecastIndicator({
      targetIndicatorId: payload.id,
    });
    addCustomForecastIndicatorToMetadata(customForecastIndicatorId);
  };

  return (
    <DialogMenu color={'gray'} size={'md'} dialogKey={DIALOG_KEY.INDICATOR_EDIT_MENU}>
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

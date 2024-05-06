'use client';

import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../view/molecule/dialog-menu';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useDialog } from '../../view/hooks/use-dialog.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useWorkspace } from '@/app/business/hooks/use-workspace.hook';
import { Indicator } from '@/app/business/services/view-model/indicator-list/indicators/indicator.service';

export default function IndicatorDialogMenu() {
  const payload = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU).payload as Indicator;
  const { createCustomForecastIndicator } = useCustomForecastIndicatorListViewModel();
  const { transitionToCustomForecastTab } = useWorkspace();
  const { addCustomForecastIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();

  const handleCustomForecastIndicatorCreate = async () => {
    transitionToCustomForecastTab();

    const customForecastIndicatorId = await createCustomForecastIndicator({
      targetIndicatorId: payload.id,
      indicatorType: payload.indicatorType,
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

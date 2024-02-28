'use client';

import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import DialogMenu from '../../view/molocule/dialog-menu';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';

export default function IndicatorDialogMenu() {
  const { transitionToCustomForecastTab } = useIndicatorBoard();

  const handleCustomForecastIndicatorCreate = () => {
    transitionToCustomForecastTab();
  };

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.INDICATOR_EDIT_MENU}>
      <DialogMenu.Item onClick={handleCustomForecastIndicatorCreate} icon={PlusCircleIcon}>
        예측 지표 생성
      </DialogMenu.Item>
    </DialogMenu>
  );
}

'use client';
import { Card } from '@tremor/react';
import CustomForecastIndicatorDialogMenu from '../ui/components/numerical-guidance/molecule/custom-forecast-indicator-dialog-menu/custom-forecast-indicator-dialog-menu';
import { useDialog } from '../ui/components/view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '../utils/keys/dialog-key';
import { useEffect } from 'react';

export default function Page() {
  const { openDialogWithPayload } = useDialog(DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU);

  useEffect(() => {
    openDialogWithPayload({
      id: '1',
    });
  }, []);

  return (
    <div className="v-screen flex w-screen items-center justify-center">
      <Card className="h-28 w-72 p-1.5">
        <CustomForecastIndicatorDialogMenu />
      </Card>
    </div>
  );
}

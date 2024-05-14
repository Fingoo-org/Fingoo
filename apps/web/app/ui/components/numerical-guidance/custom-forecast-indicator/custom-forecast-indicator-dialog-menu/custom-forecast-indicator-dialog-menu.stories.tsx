import type { Meta, StoryObj } from '@storybook/react';

import CustomForecastIndicatorDialogMenu from './custom-forecast-indicator-dialog-menu';

import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useEffect } from 'react';

const meta = {
  title: 'numerical-guidance/molecule/CustomForecastIndicatorDialogMenu',
  component: CustomForecastIndicatorDialogMenu,
} satisfies Meta<typeof CustomForecastIndicatorDialogMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { openDialogWithPayload } = useDialog(DIALOG_KEY.CUSTOM_FORECAST_INDICATOR_EDIT_MENU);

    useEffect(() => {
      openDialogWithPayload({
        id: '1',
        name: 'customForecastIndicator1',
      });
    }, []);

    return <CustomForecastIndicatorDialogMenu />;
  },
};

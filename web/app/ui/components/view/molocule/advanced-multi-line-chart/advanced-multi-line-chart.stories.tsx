import type { Meta, StoryObj } from '@storybook/react';

import { indicatorsValueMockData } from '@/app/mocks/mock-data/indicators-value.mock';
import { convertLiveIndicatorsValueViewModel } from '@/app/business/services/view-model/actual-indicators-value-view-model.service';
import AdvancedMultiLineChart from './advanced-multi-line-chart';
import { IndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';
import { Card } from '@tremor/react';

const meta = {
  title: 'view/molecule/AdvancedMultiLineChart',
  component: AdvancedMultiLineChart,
  decorators: [
    (Story: any) => (
      <Card className="h-[27.5rem] w-[47.5rem] rounded-lg bg-white shadow-lg">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof AdvancedMultiLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  indicatorsValue: indicatorsValueMockData,
};

const convertedData = convertLiveIndicatorsValueViewModel(data);

export const Default: Story = {
  args: {
    data: new IndicatorFormatter(convertedData.indicatorsValue).formattedIndicatorsInRow,
    initialIndex: 0,
  },
};

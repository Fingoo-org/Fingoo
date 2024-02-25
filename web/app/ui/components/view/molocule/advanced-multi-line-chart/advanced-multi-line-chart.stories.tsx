import type { Meta, StoryObj } from '@storybook/react';

import { indicatorsValueMockData } from '@/app/mocks/mock-data/indicators-value.mock';
import { convertIndicatorsValueViewModel } from '@/app/business/services/view-model/indicators-value-view-model.service';
import AdvancedMultiLineChart from './advanced-multi-line-chart';

const meta = {
  title: 'view/molecule/AdvancedMultiLineChart',
  component: AdvancedMultiLineChart,
} satisfies Meta<typeof AdvancedMultiLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = {
  indicatorsValue: indicatorsValueMockData,
};

const convertedData = convertIndicatorsValueViewModel(data);

export const Default: Story = {
  args: {
    data: convertedData.formattedIndicatorsInRow,
  },
};

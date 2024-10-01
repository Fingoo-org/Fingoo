import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DetailChart, { DetailChartProps } from './detail-chart';
import { indicatorTypes } from '@/app/store/stores/numerical-guidance/indicator-list.store';

const meta: Meta<typeof DetailChart> = {
  title: 'numerical-guidance/molecule/detail-chart-board/DetailChart',
  component: DetailChart,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 352 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    indicatorId: { control: 'text' },
    symbol: { control: 'text' },
    indicatorType: { control: { type: 'select', options: indicatorTypes } },
    noDataText: { control: 'text' },
    showHighLowPoints: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<DetailChartProps>;

export const Default: Story = {
  args: {
    indicatorId: '1',
    symbol: 'AAPL',
    indicatorType: 'stocks',
    noDataText: 'No chart data',
    showHighLowPoints: true,
  },
};

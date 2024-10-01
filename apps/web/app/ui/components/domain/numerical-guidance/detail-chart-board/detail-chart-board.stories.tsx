import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DetailChartBoard, { DetailChartBoardProps } from './detail-chart-board';
import { indicatorTypes } from '@/app/store/stores/numerical-guidance/indicator-list.store';

const meta: Meta<typeof DetailChartBoard> = {
  title: 'numerical-guidance/molecule/detail-chart-board/DetailChartBoard',
  component: DetailChartBoard,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    indicatorId: { control: 'text' },
    symbol: { control: 'text' },
    indicatorType: { control: { type: 'select', options: indicatorTypes } },
  },
};

export default meta;

type Story = StoryObj<DetailChartBoardProps>;

export const Default: Story = {
  args: {
    indicatorId: '1',
    symbol: 'AAPL',
    indicatorType: 'stocks',
  },
};

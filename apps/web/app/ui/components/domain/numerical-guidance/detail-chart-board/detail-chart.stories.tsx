import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DetailChart from './detail-chart';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

const meta: Meta<typeof DetailChart> = {
  title: 'numerical-guidance/atom/DetailChart',
  component: DetailChart,
  argTypes: {
    indicatorId: { control: 'text' },
    startDate: { control: 'text' },
    indicatorType: {
      control: 'select',
      options: [
        'stocks',
        'forex_pairs',
        'cryptocurrencies',
        'etf',
        'indices',
        'customForecastIndicator',
        'funds',
        'bonds',
      ],
    },
    noDataText: { control: 'text' },
    showHighLowPoints: { control: 'boolean' },
    customColor: { control: 'color' },
  },
  args: {
    indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
    startDate: '2023-01-01',
    indicatorType: 'stocks' as IndicatorType,
    noDataText: 'No data available',
    showHighLowPoints: true,
    customColor: '#ef4444',
  },
};

export default meta;

type Story = StoryObj<typeof DetailChart>;

export const Default: Story = {
  render: (args) => <DetailChart {...args} />,
};

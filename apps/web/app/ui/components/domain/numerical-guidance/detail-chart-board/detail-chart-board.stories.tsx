import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DetailChartBoard from './detail-chart-board';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

type DetailChartBoardProps = React.ComponentProps<typeof DetailChartBoard>;

const meta: Meta<DetailChartBoardProps> = {
  title: 'numerical-guidance/molecule/DetailChartBoard',
  component: DetailChartBoard,
  argTypes: {
    indicatorBoardMetadataId: { control: 'text' },
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
  },
};

export default meta;

type Story = StoryObj<DetailChartBoardProps>;

export const Default: Story = {
  args: {
    indicatorBoardMetadataId: '1', // 기본 메타데이터 ID
    indicatorType: 'stocks' as IndicatorType, // 기본 인디케이터 타입
  },
};

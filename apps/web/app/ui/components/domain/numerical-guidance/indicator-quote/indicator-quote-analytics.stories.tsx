import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IndicatorQuoteAnalytics } from './indicator-quote-analytics';

const meta: Meta<typeof IndicatorQuoteAnalytics> = {
  title: 'numerical-guidance/molecule/indicator-quote/indicatorQuoteAnalytics',
  component: IndicatorQuoteAnalytics,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 352 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    indicatorId: '1605499-4925-438-bb00-8ea6d8056484',
    symbol: 'AAPL',
    indicatorType: 'stocks',
    volumeTimePeriod: '9',
    micCode: 'XNYX',
    eod: true,
    interval: '1day',
    timezone: 'ASIA/Seoul',
  },
};

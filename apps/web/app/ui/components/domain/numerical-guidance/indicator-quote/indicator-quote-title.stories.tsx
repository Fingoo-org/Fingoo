import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IndicatorQuoteTitle } from './indicator-quote-title';

const meta: Meta<typeof IndicatorQuoteTitle> = {
  title: 'numerical-guidance/molecule/indicator-quote/indicatorTitle',
  component: IndicatorQuoteTitle,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 353 }}>
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

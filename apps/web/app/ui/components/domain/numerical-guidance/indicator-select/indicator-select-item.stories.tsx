import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import IndicatorSelectItem from './indicator-select-item';

const meta: Meta<typeof IndicatorSelectItem> = {
  title: 'community/molecule/IndicatorSelectItem',
  component: IndicatorSelectItem,
  argTypes: {
    name: { control: 'text' },
    symbol: { control: 'text' },
    type: { control: 'text' },
    isSelected: { control: 'boolean' },
    onSelect: { action: 'selected' },
  },
};

export default meta;

type Story = StoryObj<typeof IndicatorSelectItem>;

export const Default: Story = {
  args: {
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    type: 'Equity - NASDAQ',
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div className="space-y-2">
      <IndicatorSelectItem
        name="NVIDIA Corporation"
        symbol="NVDA"
        type="Equity - NASDAQ"
        isSelected={true}
        onSelect={() => {}}
      />
      <IndicatorSelectItem name="S&P 500" symbol="US500" type="RT - CFD" isSelected={false} onSelect={() => {}} />
      <IndicatorSelectItem
        name="Apple Inc."
        symbol="AAPL"
        type="Equity - NASDAQ"
        isSelected={false}
        onSelect={() => {}}
      />
    </div>
  ),
};

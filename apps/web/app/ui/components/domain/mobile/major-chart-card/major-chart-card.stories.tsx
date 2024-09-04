import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MajorChartCard from './major-chart-card';

const meta = {
  title: 'mobile/molecule/MajorChartCard',
  component: MajorChartCard,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MajorChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

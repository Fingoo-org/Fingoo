import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import MiniChart, { ChartTimeline } from './mini-chart';

const meta: Meta<typeof MiniChart> = {
  title: 'view/atom/MiniChart',
  component: MiniChart,
  argTypes: {
    data: { control: 'object' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MiniChart>;

const increasingTrendData: ChartTimeline[] = [
  { time: '2024-09-06 15:55:00', value: 390.12 },
  { time: '2024-09-06 16:00:00', value: 401.38 },
  { time: '2024-09-06 16:05:00', value: 410.5 },
  { time: '2024-09-06 16:10:00', value: 415.22 },
  { time: '2024-09-06 16:15:00', value: 420.0 },
  { time: '2024-09-06 16:20:00', value: 430.15 },
  { time: '2024-09-06 16:25:00', value: 440.9 },
];

const decreasingTrendData: ChartTimeline[] = [
  { time: '2024-09-06 15:55:00', value: 450.22 },
  { time: '2024-09-06 16:00:00', value: 440.1 },
  { time: '2024-09-06 16:05:00', value: 430.55 },
  { time: '2024-09-06 16:10:00', value: 420.9 },
  { time: '2024-09-06 16:15:00', value: 415.38 },
  { time: '2024-09-06 16:20:00', value: 410.12 },
  { time: '2024-09-06 16:25:00', value: 405.0 },
];

export const IncreasingTrend: Story = {
  args: {
    data: increasingTrendData,
    className: 'w-64 h-32',
  },
};

export const DecreasingTrend: Story = {
  args: {
    data: decreasingTrendData,
    className: 'w-64 h-32',
  },
};

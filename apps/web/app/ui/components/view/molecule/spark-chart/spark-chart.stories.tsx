import type { Meta, StoryObj } from '@storybook/react';

import SparkChart from './spark-chart';

const meta = {
  title: 'view/molecule/SparkChart',
  component: SparkChart,
} satisfies Meta<typeof SparkChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
  {
    month: 'Jan 21',
    Performance: 4000,
    Benchmark: 3000,
  },
  {
    month: 'Feb 21',
    Performance: 3000,
    Benchmark: 2000,
  },
  {
    month: 'Mar 21',
    Performance: 2000,
    Benchmark: 1700,
  },
  {
    month: 'Apr 21',
    Performance: 2780,
    Benchmark: 2500,
  },
  {
    month: 'May 21',
    Performance: 1890,
    Benchmark: 1890,
  },
  {
    month: 'Jun 21',
    Performance: 2390,
    Benchmark: 2000,
  },
  {
    month: 'Jul 21',
    Performance: 3490,
    Benchmark: 3000,
  },
];

export const Default: Story = {
  args: {
    data: mockData,
    lineChartCategories: ['Performance'],
    areaChartCategories: ['Benchmark'],
    index: 'month',
    className: 'h-24 w-56',
  },
};

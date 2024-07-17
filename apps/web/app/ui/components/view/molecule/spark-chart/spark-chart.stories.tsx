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
    Performance: {
      value: 3000,
      displayValue: 3000,
    },
    Benchmark: {
      value: 3000,
      displayValue: 3000,
    },
  },
  {
    month: 'Feb 21',
    Performance: {
      value: 2000,
      displayValue: 2000,
    },
    Benchmark: {
      value: 2000,
      displayValue: 2000,
    },
  },
  {
    month: 'Mar 21',
    Performance: {
      value: 4000,
      displayValue: 4000,
    },
    Benchmark: {
      value: 4000,
      displayValue: 4000,
    },
  },
  {
    month: 'Apr 21',
    Performance: {
      value: 5000,
      displayValue: 5000,
    },
    Benchmark: {
      value: 5000,
      displayValue: 5000,
    },
  },
  {
    month: 'May 21',
    Performance: {
      value: 6000,
      displayValue: 6000,
    },
    Benchmark: {
      value: 6000,
      displayValue: 6000,
    },
  },
  {
    month: 'Jun 21',
    Performance: {
      value: 7000,
      displayValue: 7000,
    },
    Benchmark: {
      value: 7000,
      displayValue: 7000,
    },
  },
  {
    month: 'Jul 21',
    Performance: {
      value: 8000,
      displayValue: 8000,
    },
    Benchmark: {
      value: 8000,
      displayValue: 8000,
    },
  },
  {
    month: 'Aug 21',
    Performance: {
      value: 9000,
      displayValue: 9000,
    },
    Benchmark: {
      value: 9000,
      displayValue: 9000,
    },
  },
  {
    month: 'Sep 21',
    Performance: {
      value: 10000,
      displayValue: 10000,
    },
    Benchmark: {
      value: 10000,
      displayValue: 10000,
    },
  },
  {
    month: 'Oct 21',
    Performance: {
      value: 11000,
      displayValue: 11000,
    },
    Benchmark: {
      value: 11000,
      displayValue: 11000,
    },
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

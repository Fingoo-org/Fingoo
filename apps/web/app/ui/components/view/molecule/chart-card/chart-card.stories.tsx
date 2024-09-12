import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Logo from '@/public/fingoo-logo.ico'; // Replace with your actual path to the flag image or icon
import ChartCardGrid from './chart-card';
import { ChartTimeline } from '../../atom/mini-chart/mini-chart';

const meta: Meta<typeof ChartCardGrid> = {
  title: 'view/molecule/ChartCardGrid',
  component: ChartCardGrid,
  argTypes: {
    data: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const chartDataIncreasing: ChartTimeline[] = [
  { time: '2024-09-06 15:55:00', value: 390.12 },
  { time: '2024-09-06 16:00:00', value: 401.38 },
  { time: '2024-09-06 16:05:00', value: 410.5 },
  { time: '2024-09-06 16:10:00', value: 415.22 },
  { time: '2024-09-06 16:15:00', value: 420.0 },
  { time: '2024-09-06 16:20:00', value: 430.15 },
  { time: '2024-09-06 16:25:00', value: 440.9 },
];

const chartDataDecreasing: ChartTimeline[] = [
  { time: '2024-09-06 15:55:00', value: 450.22 },
  { time: '2024-09-06 16:00:00', value: 440.1 },
  { time: '2024-09-06 16:05:00', value: 430.55 },
  { time: '2024-09-06 16:10:00', value: 420.9 },
  { time: '2024-09-06 16:15:00', value: 415.38 },
  { time: '2024-09-06 16:20:00', value: 410.12 },
  { time: '2024-09-06 16:25:00', value: 405.0 },
];

const defaultData = [
  {
    indexName: 'S&P 500',
    value: 4200.45,
    changeValue: 1.25,
    countryFlag: Logo.src,
    chartData: chartDataIncreasing,
  },
  {
    indexName: 'Dow Jones',
    value: 34875.23,
    changeValue: -0.67,
    countryFlag: Logo.src,
    chartData: chartDataDecreasing,
  },
  {
    indexName: 'S&P 500',
    value: 4200.45,
    changeValue: 1.25,
    countryFlag: Logo.src,
    chartData: chartDataIncreasing,
  },
  {
    indexName: 'Dow Jones',
    value: 34875.23,
    changeValue: -0.67,
    countryFlag: Logo.src,
    chartData: chartDataDecreasing,
  },
];

export const Default: Story = {
  args: {
    data: defaultData,
  },
};

export const WithNegativeChange: Story = {
  args: {
    data: [
      {
        indexName: 'NASDAQ',
        value: 13000.87,
        changeValue: -2.34,
        countryFlag: Logo.src,
        chartData: chartDataDecreasing,
      },
      {
        indexName: 'FTSE 100',
        value: 7200.55,
        changeValue: -0.89,
        countryFlag: Logo.src,
        chartData: chartDataDecreasing,
      },
    ],
  },
};

export const WithPositiveChange: Story = {
  args: {
    data: [
      {
        indexName: 'DAX',
        value: 15600.33,
        changeValue: 1.12,
        countryFlag: Logo.src,
        chartData: chartDataIncreasing,
      },
      {
        indexName: 'CAC 40',
        value: 6700.44,
        changeValue: 0.45,
        countryFlag: Logo.src,
        chartData: chartDataIncreasing,
      },
    ],
  },
};

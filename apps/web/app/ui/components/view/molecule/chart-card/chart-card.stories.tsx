import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Logo from '@/public/fingoo-logo.ico'; // Replace with your actual path to the flag image or icon
import ChartCardGrid from './chart-card';

const meta: Meta<typeof ChartCardGrid> = {
  title: 'view/molecule/ChartCardGrid',
  component: ChartCardGrid,
  argTypes: {
    data: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const chartMock = <div style={{ backgroundColor: '#f0f0f0', height: '100%', width: '100%' }}>Chart</div>;

const defaultData = [
  {
    indexName: 'S&P 500',
    value: 4200.45,
    changeValue: 1.25,
    countryFlag: Logo.src,
    chart: chartMock,
  },
  {
    indexName: 'Dow Jones',
    value: 34875.23,
    changeValue: -0.67,
    countryFlag: Logo.src,
    chart: chartMock,
  },
  {
    indexName: 'S&P 500',
    value: 4200.45,
    changeValue: 1.25,
    countryFlag: Logo.src,
    chart: chartMock,
  },
  {
    indexName: 'Dow Jones',
    value: 34875.23,
    changeValue: -0.67,
    countryFlag: Logo.src,
    chart: chartMock,
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
        chart: chartMock,
      },
      {
        indexName: 'FTSE 100',
        value: 7200.55,
        changeValue: -0.89,
        countryFlag: Logo.src,
        chart: chartMock,
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
        chart: chartMock,
      },
      {
        indexName: 'CAC 40',
        value: 6700.44,
        changeValue: 0.45,
        countryFlag: Logo.src,
        chart: chartMock,
      },
    ],
  },
};

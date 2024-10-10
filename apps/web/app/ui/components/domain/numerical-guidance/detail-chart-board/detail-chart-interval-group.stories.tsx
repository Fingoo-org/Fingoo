import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import DetailChartIntervalGroup from './detail-chart-interval-group';
import { SWRConfig } from 'swr';

export default {
  title: 'numerical-guidance/molecule/detail-chart-board/DetailChartIntervalGroup',
  component: DetailChartIntervalGroup,
} as Meta<typeof DetailChartIntervalGroup>;

export const Default: StoryObj<typeof DetailChartIntervalGroup> = {
  render: () => (
    <SWRConfig value={{ suspense: false }}>
      <DetailChartIntervalGroup />
    </SWRConfig>
  ),
};

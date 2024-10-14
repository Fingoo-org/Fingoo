import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartShareDrawer } from './chart-share-drawer';

const meta: Meta<typeof ChartShareDrawer> = {
  title: 'numerical-guidance/molecule/ChartShareDrawer',
  component: ChartShareDrawer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ChartShareDrawer>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MajorIndicatorCard from './major-indicator-card';

const meta: Meta<typeof MajorIndicatorCard> = {
  title: 'numerical-guidance/molecule/MajorIndicatorCard',
  component: MajorIndicatorCard,
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    country: 'US',
  },
};

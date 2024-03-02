import type { Meta, StoryObj } from '@storybook/react';

import Slider from './slider';

const meta = {
  title: 'view/atom/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [0],
  },
};

export const Range: Story = {
  args: {
    name: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [0, 100],
  },
};

export const Disabled: Story = {
  args: {
    name: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [0],
    disabled: true,
  },
};

export const Inverted: Story = {
  args: {
    name: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [0],
    inverted: true,
  },
};

export const MinStepsBetweenThumbs: Story = {
  args: {
    name: 'slider',
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 25,
    defaultValue: [0, 100],
  },
};

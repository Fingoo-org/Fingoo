import type { Meta, StoryObj } from '@storybook/react';

import ToggleGroup from '.';

const meta = {
  title: 'view/molecule/ToggleGroup',
  component: ToggleGroup,
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: ({ type, variant }) => {
    return (
      <ToggleGroup type={type} variant={variant}>
        <ToggleGroup.Item value="1">One</ToggleGroup.Item>
        <ToggleGroup.Item value="2">Two</ToggleGroup.Item>
        <ToggleGroup.Item value="3">Three</ToggleGroup.Item>
      </ToggleGroup>
    );
  },
  args: {
    type: 'single',
  },
};

export const Default: Story = {
  ...Template,
};

export const Outlined: Story = {
  ...Template,
  args: {
    type: 'single',
    variant: 'outline',
  },
};

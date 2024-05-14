import type { Meta, StoryObj } from '@storybook/react';

import PromptForm from './prompt-form';

const meta: Meta<typeof PromptForm> = {
  title: 'view/molecule/PromptForm',
  component: PromptForm,
  argTypes: {
    onValueChange: { action: 'setInput' },
  },
} satisfies Meta<typeof PromptForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
  },
};

export const DesabledInput: Story = {
  args: {
    value: '지피티랑 통신중',
    disable: true,
  },
};

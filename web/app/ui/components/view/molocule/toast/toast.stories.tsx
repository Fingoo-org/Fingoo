import type { Meta, StoryObj } from '@storybook/react';

import { Toaster } from './toaster';
import { useToast } from '../../hooks/use-toast';
import { useEffect } from 'react';
import type { Toast as ToastType } from '../../hooks/use-toast';
import { ToastAction } from './toast';

const meta = {
  title: 'view/molecule/Toast',
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<ToastType>;

const Template: Story = {
  render: ({ ...args }: ToastType) => {
    const { toast } = useToast();

    useEffect(() => {
      toast(args);
    }, []);

    return <Toaster />;
  },
};

export const Default: Story = {
  ...Template,
  args: {
    description: 'Friday, February 10, 2023 at 5:57 PM',
  },
};

export const WithTitle: Story = {
  ...Template,
  args: {
    title: 'Scheduled: Catch up ',
    description: 'Friday, February 10, 2023 at 5:57 PM',
  },
};

export const Destructive: Story = {
  ...Template,
  args: {
    title: 'Scheduled: Catch up ',
    description: 'Friday, February 10, 2023 at 5:57 PM',
    variant: 'destructive',
  },
};

export const WithDuration: Story = {
  ...Template,
  args: {
    title: 'Title',
    description: 'Description',
    duration: 2000,
  },
};

export const WithAction: Story = {
  ...Template,
  args: {
    title: 'Title',
    description: 'Description',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
};

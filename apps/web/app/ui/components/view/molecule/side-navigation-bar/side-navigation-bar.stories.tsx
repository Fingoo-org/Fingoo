import type { Meta, StoryObj } from '@storybook/react';

import SideNavigationBar from './side-navigation-bar';

const meta: Meta<typeof SideNavigationBar> = {
  title: 'view/molecule/SideNavigationBar',
  component: SideNavigationBar,
  decorators: [
    (Story) => (
      <div className="h-screen w-[1000px] bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SideNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react';

import SideNavigationBar from '.';

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

const render = () => {
  return (
    <SideNavigationBar>
      <SideNavigationBar.Content value="dashboard">
        <div>Dashboard</div>
      </SideNavigationBar.Content>
    </SideNavigationBar>
  );
};

export const Default: Story = {
  render,
};

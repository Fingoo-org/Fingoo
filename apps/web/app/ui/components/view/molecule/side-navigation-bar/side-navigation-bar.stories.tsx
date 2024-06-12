import type { Meta, StoryObj } from '@storybook/react';

import { SideNavigationBarRoot } from './side-navigation-bar-root';

const meta: Meta<typeof SideNavigationBarRoot> = {
  title: 'view/molecule/SideNavigationBar',
  component: SideNavigationBarRoot,
  decorators: [
    (Story) => (
      <div className="h-screen w-[1000px] bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SideNavigationBarRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

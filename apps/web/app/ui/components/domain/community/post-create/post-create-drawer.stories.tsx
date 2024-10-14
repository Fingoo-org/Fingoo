import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PostCreateDrawer } from './post-create-drawer';
import Button from '../../../view/atom/button/button';

const meta: Meta<typeof PostCreateDrawer> = {
  title: 'community/molecule/PostCreateDrawer',
  component: PostCreateDrawer,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-100">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCreateDrawer>;

export const InitiallyOpen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
      <>
        <div className="p-4">
          <Button onClick={() => setIsOpen(true)}>새 게시물 작성</Button>
        </div>
        <PostCreateDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
};

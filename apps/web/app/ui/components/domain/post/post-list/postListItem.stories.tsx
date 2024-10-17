import { Meta, StoryObj } from '@storybook/react';
import PostListItem from './post-list-item';
import { PostResponse } from '@/app/store/querys/post/post-list.query';

const meta = {
  title: 'Components/PostListItem',
  component: PostListItem,
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'rgb(229 231 235)', width: '375px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostListItem>;

const postItem: PostResponse = {
  postId: '1',
  author: {
    userId: '1',
    userName: 'John Doe',
    profileImageUrl: null,
  },
  createdAt: '2024-10-16',
  likeCount: 5,
  commentCount: 2,
  shareCount: 3,
  imageUrl: '/assets/images/chart_example.png',
  content: '안녕하세요',
  hasUserLiked: false,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: postItem,
  },
};

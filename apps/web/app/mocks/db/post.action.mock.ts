import { PostListResponse, UpdatePostHeartRequestBody } from '@/app/store/querys/post/post-list.query';
import { mockDatabaseStore } from '.';

export type MockPostAction = {
  getPostList: () => PostListResponse;
  patchHeart: (postId: string, data: UpdatePostHeartRequestBody) => void;
};

export const mockPostAction: MockPostAction = {
  getPostList: () => {
    return {
      data: mockDatabaseStore.post,
      meta: {
        total: mockDatabaseStore.post.length,
        hasNextData: false,
        cursor: 1,
      },
    };
  },
  patchHeart: (postId) => {
    const index = mockDatabaseStore.post.findIndex((post) => post.postId === postId);
    if (index !== -1) {
      const currentPost = mockDatabaseStore.post[index];
      const updatedPost = {
        ...currentPost,
        hasUserLiked: !currentPost.hasUserLiked,
        likeCount: currentPost.hasUserLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1,
      };
      mockDatabaseStore.post[index] = updatedPost;
    }
  },
};

import { PostListResponse } from '@/app/store/querys/post-list.query';
import { mockDatabaseStore } from '.';

export type MockPostAction = {
  getPosts: () => PostListResponse;
};

export const mockPostAction: MockPostAction = {
  getPosts: () => {
    return {
      data: mockDatabaseStore.post,
      meta: {
        total: mockDatabaseStore.post.length,
        hasNextData: false,
        cursor: 1,
      },
    };
  },
};

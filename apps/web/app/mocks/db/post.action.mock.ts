import { PostListResponse } from '@/app/store/querys/post-list.query';
import { mockDatabaseStore } from '.';

export type MockPostAction = {
  getPosts: () => PostListResponse;
};

export const mockPostAction: MockPostAction = {
  getPosts: () => {
    // mockDatabaseStore.post는 배열이므로, 첫 번째 페이지의 데이터를 반환하도록 수정
    const firstPageData = mockDatabaseStore.post[0];

    return {
      data: firstPageData.data,
      meta: {
        total: firstPageData.meta.total,
        hasNextData: firstPageData.meta.hasNextData,
        cursor: firstPageData.meta.cursor,
      },
    };
  },
};

import { useMemo } from 'react';
import { useAddHeartToPost, useDeleteHeartFromPost, useFetchPostList } from '@/app/store/querys/post/post-list.query';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { PostList, convertPostList } from '../../services/post/view-model/post-list/post-list-view-model.service';

export const usePostList = () => {
  // 무한스크롤 데이터 불러오기
  const { data: postList, setSize, isValidating } = useFetchPostList();
  // selectedPost를 workspace.ts에서 정의
  const selectedPostId = useWorkspaceStore((state) => state.selectedPostId);
  const { trigger: addHeartTrigger } = useAddHeartToPost(selectedPostId);
  const { trigger: deleteHeartTrigger } = useDeleteHeartFromPost();

  const convertedPostList = useMemo(() => {
    if (!postList) return undefined;
    const allPosts = postList.flatMap((page) => page.data);
    return convertPostList(allPosts);
  }, [postList]);

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return undefined;
    return convertedPostList?.findPostById(selectedPostId);
  }, [selectedPostId, convertedPostList]);

  const optimisticRevalidateOption = { revalidate: false }; // optimistic update용 옵션

  // 하트 추가 기능 (optimistic update 적용)
  const addHeartToPost = async (postId: string) => {
    if (!postId) return;
    addHeartTrigger(
      { postId },
      {
        optimisticData: (): PostList | undefined => {
          const newPostList = convertedPostList?.addHeartToPostById(postId);
          return newPostList;
        },
        ...optimisticRevalidateOption,
      },
    );
  };

  // 하트 제거 기능 (optimistic update 적용)
  const removeHeartFromPost = async (postId: string) => {
    if (!postId) return;

    deleteHeartTrigger(postId, {
      optimisticData: (): PostList | undefined => {
        const newPostList = convertedPostList?.removeHeartFromPostById(postId);
        return newPostList;
      },
      ...optimisticRevalidateOption,
    });
  };

  return {
    selectedPostId,
    selectedPost,
    postList: convertedPostList, // 무한 스크롤
    isPending: isValidating,
    addHeartToPost, // 하트 추가 기능
    removeHeartFromPost, // 하트 제거 기능
    loadMorePosts: () => setSize((size) => size + 1), // 추가 포스트 로드
  };
};

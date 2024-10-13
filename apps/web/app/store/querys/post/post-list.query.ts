import useSWRInfinite from 'swr/infinite';
import { defaultFetcher, deleteFetcher, postFetcher } from '../fetcher';
import { API_PATH } from '../api-path';
import useSWRMutation from 'swr/mutation';

// 사용자 정보 타입 정의
export type UserResponse = {
  userId: string; // 사용자 고유 ID
  userName: string; // 사용자 이름
  profileImageUrl: string | null; // 프로필 이미지 URL (null일 수 있음)
};

// 게시물 정보 타입 정의
export type PostResponse = {
  postId: string; // 게시물 고유 ID
  author: UserResponse; // 게시물 작성자 정보
  content: string; // 게시물 내용
  imageUrl?: string; // 게시물에 포함된 이미지 URL (선택적)
  createdAt: string; // 게시물 작성 시간 (ISO 포맷의 문자열)
  likeCount: number; // 좋아요 수
  commentCount: number; // 댓글 수
  shareCount: number; // 공유 수
  hasUserLiked: boolean; // 사용자가 이 게시물에 좋아요를 눌렀는지 여부
};

export type PaginationMeta = {
  total: number;
  hasNextData: boolean;
  cursor: number;
};

export type PostListResponse = {
  data: PostResponse[];
  meta: PaginationMeta;
};

type AddOrDeleteHeartToPostRequestBody = Pick<PostResponse, 'postId'>;

// Infinite Scroll을 위한 키 생성 함수
export const createKeyMakerPostListInfinite = () => {
  return (pageIndex: number, previousPageData: PostListResponse | null) => {
    // 이전 페이지의 데이터가 없거나 마지막 페이지에 도달했을 때 null 반환
    if (previousPageData && !previousPageData.meta.hasNextData) {
      return null;
    }

    // 첫 번째 페이지의 경우
    if (pageIndex === 0) {
      return `${API_PATH.postList}/list?cursorToken=1`;
    }

    // 다음 페이지의 커서를 추가하여 API 엔드포인트 생성
    return `${API_PATH.postList}/list?cursorToken=${previousPageData?.meta.cursor}`;
  };
};

// 최신 게시물 데이터를 무한 스크롤 방식으로 패치하는 훅
export const useFetchPostList = () => {
  return useSWRInfinite<PostListResponse>(createKeyMakerPostListInfinite(), defaultFetcher);
};

export const useFetchPost = () => {
  // 게시물 하나를 가져오는 로직이 필요하면 여기에 추가합니다.
};

// 하트 추가요청 to 서버: API_PATH/postHeart/123
export const useAddHeartToPost = (postId: string | undefined) =>
  useSWRMutation(API_PATH.postHeart, async (url: string, { arg }: { arg: AddOrDeleteHeartToPostRequestBody }) => {
    if (!postId) return;
    await postFetcher<AddOrDeleteHeartToPostRequestBody>([url, postId], {
      arg,
    });
  });

// 하트 삭제요청 to 서버: API_PATH/postHeart/123
export const useDeleteHeartFromPost = () => {
  return useSWRMutation(API_PATH.postHeart, async (url, { arg: postId }: { arg: string }) => {
    await deleteFetcher([url, postId]);
  });
};

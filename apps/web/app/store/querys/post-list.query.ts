import useSWRInfinite from 'swr/infinite';
import { API_PATH } from './api-path';
import { defaultFetcher } from './fetcher';

// 사용자 정보 타입 정의
export type UserResponse = {
  id: string; // 사용자 고유 ID
  userName: string; // 사용자 이름
  profileImageUrl: string | null; // 프로필 이미지 URL (null일 수 있음)
};

// 게시물 정보 타입 정의
export type PostResponse = {
  id: string; // 게시물 고유 ID
  author: UserResponse; // 게시물 작성자 정보
  content: string; // 게시물 내용
  imageUrl?: string; // 게시물에 포함된 이미지 URL (선택적)
  createdAt: string; // 게시물 작성 시간 (ISO 포맷의 문자열)
  likeCount: number; // 좋아요 수
  commentCount: number; // 댓글 수
  shareCount: number; // 공유 수
  hasUserLiked: boolean; // 사용자가 이 게시물에 좋아요를 눌렀는지 여부
};

type PaginationMeta = {
  total: number;
  hasNextData: boolean;
  cursor: number;
};

export type PostListResponse = {
  data: PostResponse[];
  meta: PaginationMeta;
};

export const createKeyMakerIndicatorListInfinite = () => {
  return (pageIndex: number, previousPageData: PostListResponse) => {
    // 끝에 도달
    if (previousPageData && !previousPageData.meta.hasNextData) return null;

    // 첫 페이지, `previousPageData`가 없음
    if (pageIndex === 0) return `${API_PATH.postList}/list?cursorToken=1`;

    // API의 엔드포인트에 커서를 추가
    return `${API_PATH.postList}/list?cursorToken=${previousPageData.meta.cursor}`;
  };
};

// 최신순(?)에 의한 데이터 무한스크롤 패칭
export const useFetchPostList = () => {
  return useSWRInfinite<PostListResponse>(createKeyMakerIndicatorListInfinite(), defaultFetcher);
};

export const useFetchPost = () => {};

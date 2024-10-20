'use client';

import { Post } from '@/app/business/services/post/view-model/post-list/post-view-model.service';
import PostListItem from '@/app/ui/components/domain/post/post-list/post-list-item';
import PostSearchBar from '@/app/ui/components/domain/post/post-list/post-search-bar';

export default function MobileTestPage() {
  // 예시 데이터
  const examplePost: Post = {
    postId: '123',
    author: {
      userId: 'user_1',
      userName: '김철수',
      profileImageUrl: '/default-avatar.png',
    },
    content: '안녕하세요\n주식이 처음이라 궁금한점 질문드려요',
    imageUrl: undefined,
    createdAt: '1시간 전',
    likeCount: 160,
    commentCount: 15,
    shareCount: 6,
    hasUserLiked: false,
    formattedPost: {
      postId: '',
      author: {
        userId: '',
        userName: '',
        profileImageUrl: null,
      },
      content: '',
      imageUrl: undefined,
      createdAt: '',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      hasUserLiked: false,
    },
  };

  const examplePostWithImage: Post = {
    postId: '456',
    author: {
      userId: 'user_2',
      userName: 'David Choi',
      profileImageUrl: '/default-avatar.png',
    },
    content: '주식이 처음이라 궁금한점 질문드려요',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2시간 전',
    likeCount: 160,
    commentCount: 15,
    shareCount: 6,
    hasUserLiked: false,
    formattedPost: {
      postId: '',
      author: {
        userId: '',
        userName: '',
        profileImageUrl: null,
      },
      content: '',
      imageUrl: undefined,
      createdAt: '',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      hasUserLiked: false,
    },
  };

  return (
    <div className="flex flex-col">
      <div className="ml-3 mr-3 flex flex-col">
        <div className="flex flex-row justify-between gap-x-10">
          <PostSearchBar />
          <img src="/assets/images/bell.svg" alt="Bell Icon" />
        </div>
      </div>
      <div className="mt-3 flex flex-row items-center justify-between border-b-2 border-gray-400 border-opacity-30 px-3">
        <div className="flex gap-4">
          <div className="font-semibold text-gray-700">팔로잉</div>
          <div className="border-b-2 border-teal-500 font-semibold text-teal-500">최신</div>
        </div>
        <button className="h-[28px] rounded-full bg-white px-3 text-[14px] text-gray-700 ">게시글 작성</button>
        <img src="/assets/images/roundeduser.svg" alt="User Icon" />
      </div>
      <div className="max-h-screen overflow-y-auto">
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
        <PostListItem item={examplePost} style={{}} />
        <PostListItem item={examplePostWithImage} style={{}} />
      </div>
    </div>
  );
}

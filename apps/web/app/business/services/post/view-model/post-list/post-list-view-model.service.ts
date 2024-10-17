import { PostResponse } from '@/app/store/querys/post/post-list.query';
import { Post } from './post-view-model.service';

export class PostList extends Array<Post> {
  constructor(postList: PostResponse[]) {
    super();
    postList.forEach((post) => {
      this.push(new Post(post));
    });
  }

  static get [Symbol.species]() {
    return Array;
  }

  get formattedPostList() {
    return this.map((post) => post.formattedPost);
  }

  // iterate 메서드: 특정 콜백을 사용해 Post 인스턴스를 업데이트하고 PostList로 반환
  iterate(callback: (post: Post) => Post): PostList {
    return convertPostList(this.map(callback));
  }

  // 특정 postId로 Post 찾기
  findPostById(postId: string) {
    return this.find((post) => post.postId === postId);
  }

  // 특정 postId로 Post 삭제하기
  deletePostById(postId: string) {
    return convertPostList(this.filter((post) => post.postId !== postId));
  }

  // 특정 postId에 하트 추가 (유저가 하트를 누를 때)
  toggleHeartByPostId(postId: string | undefined) {
    return this.iterate((post) => {
      if (post.postId === postId) {
        if (post.hasUserLiked) {
          // 이미 하트를 눌렀을 경우 하트를 해제
          post.likeCount -= 1;
          post.hasUserLiked = false;
        } else {
          // 하트를 누르지 않은 경우 하트를 추가
          post.likeCount += 1;
          post.hasUserLiked = true;
        }
      }
      return post;
    });
  }

  // 특정 postId에 하트 추가 (누른 경우 빨간색 하트)
  addHeartToPostById(postId: string | undefined) {
    return this.iterate((post) => {
      if (post.postId === postId) {
        post.likeCount += 1;
        post.hasUserLiked = true;
      }
      return post;
    });
  }

  // 특정 postId에 하트 제거 (해제한 경우 투명한 하트)
  removeHeartFromPostById(postId: string | undefined) {
    return this.iterate((post) => {
      if (post.postId === postId && post.likeCount > 0) {
        post.likeCount -= 1;
        post.hasUserLiked = false;
      }
      return post;
    });
  }
}

export const convertPostList = (response: PostResponse[]) => {
  return new PostList(response);
};

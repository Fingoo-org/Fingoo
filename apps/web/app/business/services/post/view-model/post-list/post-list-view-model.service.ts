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

  iterate(callback: (post: Post) => Post): PostList {
    return convertPostList(this.map(callback));
  }

  findPostById(postId: string) {
    return this.find((post) => post.postId === postId);
  }

  deletePostById(postId: string) {
    return convertPostList(this.filter((post) => post.postId !== postId));
  }

  toggleHeartByPostId(postId: string | undefined) {
    return this.iterate((post) => {
      if (post.postId === postId) {
        if (post.hasUserLiked) {
          post.likeCount -= 1;
          post.hasUserLiked = false;
        } else {
          post.likeCount += 1;
          post.hasUserLiked = true;
        }
      }
      return post;
    });
  }

  updateHeartStatusByPostId(postId: string | undefined, hasUserLiked: boolean) {
    return this.iterate((post) => {
      if (post.postId === postId) {
        if (hasUserLiked) {
          if (!post.hasUserLiked) {
            post.likeCount += 1;
            post.hasUserLiked = true;
          }
        } else {
          if (post.hasUserLiked) {
            post.likeCount -= 1;
            post.hasUserLiked = false;
          }
        }
      }
      return post;
    });
  }
}

export const convertPostList = (response: PostResponse[]) => {
  return new PostList(response);
};

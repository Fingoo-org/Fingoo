import { PostResponse } from '@/app/store/querys/post/post-list.query';

export class Post {
  readonly postId: string;
  readonly author: {
    userId: string;
    userName: string;
    profileImageUrl: string | null;
  };
  readonly content: string;
  readonly imageUrl?: string;
  readonly createdAt: string;
  likeCount: number;
  readonly commentCount: number;
  readonly shareCount: number;
  hasUserLiked: boolean;

  constructor({
    postId,
    author,
    content,
    imageUrl,
    createdAt,
    likeCount,
    commentCount,
    shareCount,
    hasUserLiked,
  }: PostResponse) {
    this.postId = postId;
    this.author = {
      userId: author.userId,
      userName: author.userName,
      profileImageUrl: author.profileImageUrl,
    };
    this.content = content;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
    this.shareCount = shareCount;
    this.hasUserLiked = hasUserLiked;
  }

  get formattedPost(): PostResponse {
    return {
      postId: this.postId,
      author: {
        userId: this.author.userId,
        userName: this.author.userName,
        profileImageUrl: this.author.profileImageUrl,
      },
      content: this.content,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      shareCount: this.shareCount,
      hasUserLiked: this.hasUserLiked,
    };
  }
}

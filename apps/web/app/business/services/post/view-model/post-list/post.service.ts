import { PostResponse } from '@/app/store/querys/post-list.query';

export class Post {
  readonly id: string;
  readonly author: {
    id: string;
    userName: string;
    profileImageUrl: string | null;
  };
  readonly content: string;
  readonly imageUrl?: string;
  readonly createdAt: string;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly shareCount: number;
  readonly hasUserLiked: boolean;

  constructor({
    id,
    author,
    content,
    imageUrl,
    createdAt,
    likeCount,
    commentCount,
    shareCount,
    hasUserLiked,
  }: PostResponse) {
    this.id = id;
    this.author = {
      id: author.id,
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
      id: this.id,
      author: {
        id: this.author.id,
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

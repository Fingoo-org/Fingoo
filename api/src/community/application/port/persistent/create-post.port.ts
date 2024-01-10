import { Post } from 'src/community/domain/post';

export interface CreatePostPort {
  createPost(post: Post): Promise<boolean>;
}

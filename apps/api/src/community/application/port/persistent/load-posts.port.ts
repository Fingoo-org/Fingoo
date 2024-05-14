import { PostDto } from '../../query/get-posts/post.dto';

export interface LoadPostsPort {
  loadPosts(): Promise<PostDto[]>;
}

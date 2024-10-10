import { PostResponse } from '@/app/store/querys/post-list.query';
import { Post } from './post-list/post.service';

export function convertPostViewModel(data: PostResponse[]): Post[] {
  return data.map((post) => new Post(post));
}

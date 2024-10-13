import { PostResponse } from '@/app/store/querys/post/post-list.query';
import { Post } from './post-list/post-view-model.service';

export function convertPostViewModel(postList: PostResponse[]): Post[] {
  return postList.map((post) => new Post(post)); // PostResponse 배열을 Post 배열로 변환
}

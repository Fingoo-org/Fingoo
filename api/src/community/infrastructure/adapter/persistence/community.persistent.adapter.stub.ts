import { Injectable } from '@nestjs/common';
import { CreatePostPort } from 'src/community/application/port/persistent/create-post.port';
import { Post } from 'src/community/domain/post';
import { PostEntity } from './entity/post.entity';
import { LoadPostsPort } from 'src/community/application/port/persistent/load-posts.port';
import { PostDto } from 'src/community/application/query/get-posts/post.dto';

const testData = [
  {
    content: 'test',
  },
  {
    content: 'test1',
  },
  {
    content: 'test2',
  },
  {
    content: 'test3',
  },
];

@Injectable()
export class CommunityPersistentAdapter implements CreatePostPort, LoadPostsPort {
  //mock
  async createPost(post: Post): Promise<boolean> {
    //mapper 함수로 처리해야함
    const postEntity = new PostEntity();
    postEntity.content = post.content;

    // repository로 save

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  async loadPosts(): Promise<PostDto[]> {
    const posts = testData.map((data) => {
      const post = new PostDto();
      post.content = data.content;
      return post;
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(posts);
      }, 2000);
    });
  }
}

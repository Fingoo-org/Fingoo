import { Injectable } from '@nestjs/common';
import { CreatePostPort } from 'src/community/application/port/persistent/post/create-post.port';
import { Post } from 'src/community/domain/post';
import { PostEntity } from './entity/post.entity';

@Injectable()
export class CommunityPersistentAdapter implements CreatePostPort {
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
}

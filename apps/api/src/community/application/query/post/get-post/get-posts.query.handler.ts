import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQuery } from '../get-posts/get-posts.query';
import { LoadPostsPort } from '../../../port/persistent/load-posts.port';
import { PostDto } from './dto/post.dto';

@Injectable()
@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler {
  constructor(@Inject('LoadPostsPort') private readonly loadPostsport: LoadPostsPort) {}

  async execute(): Promise<PostDto[]> {
    return await this.loadPostsport.loadPosts();
  }
}

import { Module } from '@nestjs/common';
import { CommunityController } from './infrastructure/api/community.controller';
import { CreatePostCommandHandler } from './application/command/create-post/create-post.command.handler';
import { CommunityPersistentAdapter } from './infrastructure/adapter/persistent/community.persistent.adapter.stub';
import { GetPostsQueryHandler } from './application/query/get-posts/get-posts.query.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [CommunityController],
  providers: [
    CreatePostCommandHandler,
    GetPostsQueryHandler,
    {
      provide: 'CreatePostPort',
      useClass: CommunityPersistentAdapter,
    },
    {
      provide: 'LoadPostsPort',
      useClass: CommunityPersistentAdapter,
    },
  ],
})
export class CommunityModule {}

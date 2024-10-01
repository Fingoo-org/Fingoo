import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostController } from './api/post.controller';
import { CreatePostCommandHandler } from './application/command/post/create-post/create-post.command.handler';
import { CommunityPersistentAdapter } from './infrastructure/adapter/persistence/community.persistent.adapter';

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [
    CreatePostCommandHandler,
    {
      provide: 'CreatePostPort',
      useClass: CommunityPersistentAdapter,
    },
  ],
})
export class CommunityModule {}

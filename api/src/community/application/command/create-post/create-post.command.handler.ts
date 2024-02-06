import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Inject, Injectable } from '@nestjs/common';
import { Post } from 'src/community/domain/post';
import { CreatePostPort } from '../../port/persistent/create-post.port';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler implements ICommandHandler {
  constructor(@Inject('CreatePostPort') private readonly createPostPort: CreatePostPort) {}

  async execute(command: CreatePostCommand) {
    const { content } = command;
    const post = Post.createNew(content);

    await this.createPostPort.createPost(post);
    console.log('husky test');
    return post;
  }
}

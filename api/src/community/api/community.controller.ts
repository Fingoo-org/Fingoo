import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from 'src/community/application/command/create-post/create-post.command';
import { GetPostsQuery } from 'src/community/application/query/get-posts/get-posts.query';
import { Response } from 'express';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('/api/community')
export class CommunityController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('/')
  async getPosts() {
    return this.queryBus.execute(new GetPostsQuery());
  }

  @Post('/post')
  async createPost(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    const command = new CreatePostCommand(createPostDto.content, crypto.randomUUID());
    await this.commandBus.execute(command);
    res.status(HttpStatus.CREATED).send();
  }
}

// curl -X POST https://bug-free-acorn-rpj6qwvvjw73xxv9-3000.app.github.dev/community/post -w "%{http_code}\n" -H "Content-Type: application/json" -d '{"content": "포스팅"}'

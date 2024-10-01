import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from 'src/community/application/command/post/create-post/create-post.command';
import { GetPostsQuery } from 'src/community/application/query/post/get-post/get-posts.query';
import { Response } from 'express';
import { CreatePostRequestDto } from './dto/request/create-post.request.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../utils/exception-filter/api-exception-response.decorator';
import { UpdatePostResponseDto } from './dto/response/update-post.response.dto';
import { UpdatePostCommand } from '../application/command/post/update-post/update-post.command';
import { DeletePostCommand } from '../application/command/post/delete-post/delete-post.command';
import { UpdatePostRequestDto } from './dto/request/update-post.request.dto';
import { CreatePostResponseDto } from './dto/response/create-post.response.dto';
import { LoginUser } from '../../auth/util/get-login-user.decorator';
import { User } from '@supabase/supabase-js';
import { CustomAuthGuard } from '../../auth/util/custom-auth.guard';

@ApiTags('PostController')
@Controller('/api/community/post')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: '커뮤니티에 게시글을 작성합니다.' })
  @ApiResponse({ status: 201, description: '게시글 작성 성공', type: CreatePostResponseDto })
  @ApiExceptionResponse(400, 'Bad Request', '[ERROR]400 Bad Request')
  @ApiExceptionResponse(404, 'Not Found', '[ERROR]404 Not Found')
  @ApiBearerAuth('Authorization')
  @Post()
  @UseGuards(CustomAuthGuard)
  async createPost(@Body() createPostRequestDto: CreatePostRequestDto, @LoginUser() user: User) {
    const command = new CreatePostCommand(createPostRequestDto.content, user.id);
    return this.commandBus.execute(command);
  }

  @Get()
  async getPost() {
    return this.queryBus.execute(new GetPostsQuery());
  }

  @Get('/:postId')
  async getPosts() {
    return this.queryBus.execute(new GetPostsQuery());
  }

  @ApiOperation({ summary: '커뮤니티에 게시글을 수정합니다.' })
  @ApiResponse({ status: 200, description: '게시글 수정 성공', type: UpdatePostResponseDto })
  @ApiExceptionResponse(400, 'Bad Request', '[ERROR]400 Bad Request')
  @ApiExceptionResponse(404, 'Not Found', '[ERROR]404 Not Found')
  @ApiBearerAuth('Authorization')
  @Patch('/:postId')
  @UseGuards(CustomAuthGuard)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostRequestDto: UpdatePostRequestDto,
    @LoginUser() user: User,
  ) {
    const command = new UpdatePostCommand(updatePostRequestDto.content, postId, user.id);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '커뮤니티에 게시글을 삭제합니다.' })
  @ApiResponse({ status: 204, description: '게시글 삭제 성공' })
  @ApiExceptionResponse(400, 'Bad Request', '[ERROR]400 Bad Request')
  @ApiExceptionResponse(404, 'Not Found', '[ERROR]404 Not Found')
  @ApiBearerAuth('Authorization')
  @Delete('/:postId')
  @UseGuards(CustomAuthGuard)
  async deletePost(@Param('postId') postId: string, @LoginUser() user: User, @Res() res: Response) {
    const command = new DeletePostCommand(postId, user.id);
    await this.commandBus.execute(command);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}

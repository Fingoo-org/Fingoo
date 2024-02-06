import { Test } from '@nestjs/testing';
import { CommunityController } from 'src/community/api/community.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetPostsQueryHandler } from 'src/community/application/query/get-posts/get-posts.query.handler';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CreatePostCommandHandler } from 'src/community/application/command/create-post/create-post.command.handler';
import { CONTENT_LIMIT_RULE } from 'src/community/domain/rule/PostContentLengthShouldNotExceedLimit.rule';

describe('CommunityController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CommunityController],
      providers: [
        GetPostsQueryHandler,
        CreatePostCommandHandler,
        {
          provide: 'CreatePostPort',
          useValue: {
            createPost: jest.fn(),
          },
        },
        {
          provide: 'LoadPostsPort',
          useValue: {
            loadPosts: jest.fn(),
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/get 포스팅 리스트를 조회한다', () => {
    return request(app.getHttpServer()).get('/community').expect(200);
  });

  it('/post 포스팅을 게시한다', () => {
    const content = '*'.repeat(10);

    return request(app.getHttpServer())
      .post('/community/post')
      .send({ content: content })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 사용자가 유효하지 않는 값 전송한다.', () => {
    const content = '*'.repeat(3);

    return request(app.getHttpServer())
      .post('/community/post')
      .send({ content: content })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/post 사용자가 촤대 글자수를 초과하여 게시한다.', () => {
    const content = '*'.repeat(CONTENT_LIMIT_RULE + 1);

    return request(app.getHttpServer())
      .post('/community/post')
      .send({ content: content })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});

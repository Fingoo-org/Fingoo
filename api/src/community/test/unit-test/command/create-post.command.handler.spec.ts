import { Post } from 'src/community/domain/post';
import { Test } from '@nestjs/testing';
import { CreatePostCommand } from 'src/community/application/command/create-post/create-post.command';
import { CreatePostCommandHandler } from 'src/community/application/command/create-post/create-post.command.handler';
import { CreatePostPort } from 'src/community/application/port/persistent/create-post.port';

jest.spyOn(crypto, 'randomUUID').mockReturnValue('0000-0000-0000-0000-0000');

describe('CreatePostCommandHandler', () => {
  let createPostCommandHandler: CreatePostCommandHandler;
  let createPostPort: CreatePostPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreatePostCommandHandler,
        {
          provide: 'CreatePostPort',
          useValue: {
            createPost: jest.fn(),
          },
        },
      ],
    }).compile();

    createPostCommandHandler = module.get(CreatePostCommandHandler);
    createPostPort = module.get('CreatePostPort');
  });

  it('포스팅을 게시한다', async () => {
    //given
    const content = '*'.repeat(10);
    const uuid = crypto.randomUUID();

    //when
    const command = new CreatePostCommand(content, uuid);
    const result = await createPostCommandHandler.execute(command);

    //then
    const expected = new Post(content);
    expect(result).toEqual(expected);
    expect(createPostPort.createPost).toHaveBeenCalledWith(expected);
  });
});

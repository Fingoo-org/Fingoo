import { Test } from '@nestjs/testing';
import { LoadPostsPort } from 'src/community/application/port/persistent/load-posts.port';
import { GetPostsQueryHandler } from 'src/community/application/query/get-posts/get-posts.query.handler';
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

describe('GetPostsQueryHandler', () => {
  let getPostsQueryHander: GetPostsQueryHandler;
  let loadPostsPort: LoadPostsPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPostsQueryHandler,
        {
          provide: 'LoadPostsPort',
          useValue: {
            loadPosts: jest.fn().mockImplementation(() => {
              return testData.map((data) => {
                const post = new PostDto();
                post.content = data.content;
                return post;
              });
            }),
          },
        },
      ],
    }).compile();

    getPostsQueryHander = module.get(GetPostsQueryHandler);
    loadPostsPort = module.get('LoadPostsPort');
  });

  it('포스팅 리스트를 조회한다', async () => {
    //given

    //when
    const result = await getPostsQueryHander.execute();

    //then
    const expected = new PostDto();
    expected.content = testData[0].content;
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual(expected);
    expect(loadPostsPort.loadPosts).toHaveBeenCalled();
  });
});

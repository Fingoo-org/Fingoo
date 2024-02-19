import { Test } from '@nestjs/testing';
import { GetMemberIndicatorBoardMetadataListQuery } from 'src/numerical-guidance/application/query/get-user-indicator-board-metadata-list/get-member-indicator-board-metadata-list.query';
import { GetMemberIndicatorBoardMetadataListQueryHandler } from 'src/numerical-guidance/application/query/get-user-indicator-board-metadata-list/get-member-indicator-board-metadata-list.query.handler';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

describe('Get user indicator board metadata list query handler', () => {
  let getMemberIndicatorBoardMetadataListQueryHandler: GetMemberIndicatorBoardMetadataListQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetMemberIndicatorBoardMetadataListQueryHandler,
        {
          provide: 'LoadMemberIndicatorBoardMetadataListPort',
          useValue: {
            loadMemberIndicatorBoardMetadataList: jest.fn().mockImplementation(() => {
              const dataList = [IndicatorBoardMetadata.createNew('메타데이터')];
              return dataList;
            }),
          },
        },
      ],
    }).compile();
    getMemberIndicatorBoardMetadataListQueryHandler = module.get(GetMemberIndicatorBoardMetadataListQueryHandler);
  }, 10000);
  it('사용자 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetMemberIndicatorBoardMetadataListQuery(1);
    // when
    const result = await getMemberIndicatorBoardMetadataListQueryHandler.execute(testQuery);
    // then
    const expected = [IndicatorBoardMetadata.createNew('메타데이터')];
    expect(result).toEqual(expected);
  });
});

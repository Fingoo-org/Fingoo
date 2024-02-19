import { Test } from '@nestjs/testing';
import { GetUserIndicatorBoardMetadataListQuery } from 'src/numerical-guidance/application/query/get-user-indicator-board-metadata-list/get-user-indicator-board-metadata-list.query';
import { GetUserIndicatorBoardMetadataListQueryHandler } from 'src/numerical-guidance/application/query/get-user-indicator-board-metadata-list/get-usser-indicator-board-metadata-list.query.handler';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

describe('Get user indicator board metadata list query handler', () => {
  let getUserIndicatorBoardMetadataListQueryHandler: GetUserIndicatorBoardMetadataListQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserIndicatorBoardMetadataListQueryHandler,
        {
          provide: 'LoadUserIndicatorBoardMetadataListPort',
          useValue: {
            loadUserIndicatorBoardMetadataList: jest.fn().mockImplementation(() => {
              const dataList = [IndicatorBoardMetadata.createNew('메타데이터')];
              return dataList;
            }),
          },
        },
      ],
    }).compile();
    getUserIndicatorBoardMetadataListQueryHandler = module.get(GetUserIndicatorBoardMetadataListQueryHandler);
  }, 10000);
  it('사용자 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetUserIndicatorBoardMetadataListQuery(1);
    // when
    const result = await getUserIndicatorBoardMetadataListQueryHandler.execute(testQuery);
    // then
    const expected = [IndicatorBoardMetadata.createNew('메타데이터')];
    expect(result).toEqual(expected);
  });
});

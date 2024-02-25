import { Test } from '@nestjs/testing';
import { GetIndicatorBoardMetadataListQuery } from 'src/numerical-guidance/application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query';
import { GetIndicatorBoardMetadataListQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

describe('GetIndicatorBoardMetadataListQueryHandler', () => {
  let getMemberIndicatorBoardMetadataListQueryHandler: GetIndicatorBoardMetadataListQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorBoardMetadataListQueryHandler,
        {
          provide: 'LoadIndicatorBoardMetadataListPort',
          useValue: {
            loadIndicatorBoardMetadataList: jest.fn().mockImplementation(() => {
              const dataList = [IndicatorBoardMetadata.createNew('메타데이터')];
              return dataList;
            }),
          },
        },
      ],
    }).compile();
    getMemberIndicatorBoardMetadataListQueryHandler = module.get(GetIndicatorBoardMetadataListQueryHandler);
  }, 10000);
  it('사용자 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetIndicatorBoardMetadataListQuery(1);
    // when
    const result = await getMemberIndicatorBoardMetadataListQueryHandler.execute(testQuery);
    // then
    const expected = [IndicatorBoardMetadata.createNew('메타데이터')];
    expect(result).toEqual(expected);
  });
});

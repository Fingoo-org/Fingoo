import { Test } from '@nestjs/testing';
import { GetIndicatorBoardMetadataListQuery } from 'src/numerical-guidance/application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query';
import { GetIndicatorBoardMetadataListQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { IndicatorBoardMetadataDto } from '../../../application/query/get-indicator-board-metadata/indicator-board-metadata.dto';

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
    const result: IndicatorBoardMetadataDto[] =
      await getMemberIndicatorBoardMetadataListQueryHandler.execute(testQuery);
    // then
    const expected: IndicatorBoardMetadata[] = [IndicatorBoardMetadata.createNew('메타데이터')];
    expect(result.length).toEqual(expected.length);
    expect(result[0].indicatorBoardMetadataName).toEqual(expected[0].indicatorBoardMetadataName);
    expect(result[0].indicatorIds).toEqual(expected[0].indicatorIds);
  });
});

import { Test } from '@nestjs/testing';
import { GetIndicatorBoardMetadataQuery } from 'src/numerical-guidance/application/query/get-indicator-board-metadata/get-indicator-board-metadata.query';
import { GetIndicatorBoardMetaDataQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

describe('GetIndicatorBoardMetaDataQueryHandler', () => {
  let getIndicatorBoardMetadataQueryHandler: GetIndicatorBoardMetaDataQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorBoardMetaDataQueryHandler,
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetaData: jest.fn().mockImplementation(() => {
              const data = IndicatorBoardMetadata.createNew('메타데이터');
              return data;
            }),
          },
        },
      ],
    }).compile();
    getIndicatorBoardMetadataQueryHandler = module.get(GetIndicatorBoardMetaDataQueryHandler);
  }, 10000);

  it('지표보드 메타데이터 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetIndicatorBoardMetadataQuery('uuid');
    // when
    const result = await getIndicatorBoardMetadataQueryHandler.execute(testQuery);
    // then
    const expected = '메타데이터';
    expect(result.indicatorBoardMetaDataName).toEqual(expected);
  });
});

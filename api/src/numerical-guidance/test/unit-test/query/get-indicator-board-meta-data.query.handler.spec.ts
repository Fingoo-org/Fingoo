import { Test } from '@nestjs/testing';
import { GetIndicatorBoardMetaDataQuery } from 'src/numerical-guidance/application/query/get-indicator-board-meta-data/get-indicator-board-meta-data.query';
import { GetIndicatorBoardMetaDataQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-meta-data/get-indicator-board-meta-data.query.handler';
import { IndicatorBoardMetaData } from 'src/numerical-guidance/domain/indicator-board-meta-data';

describe('GetIndicatorBoardMetaDataQueryHandler', () => {
  let getIndicatorBoardMetaDataQueryHandler: GetIndicatorBoardMetaDataQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorBoardMetaDataQueryHandler,
        {
          provide: 'LoadIndicatorBoardMetaDataPort',
          useValue: {
            loadIndicatorBoardMetaData: jest.fn().mockImplementation(() => {
              const data = IndicatorBoardMetaData.createNew('메타데이터', { key1: ['1', '2', '3'] }, 1);
              return data;
            }),
          },
        },
      ],
    }).compile();
    getIndicatorBoardMetaDataQueryHandler = module.get(GetIndicatorBoardMetaDataQueryHandler);
  }, 10000);

  it('지표보드 메타데이터 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetIndicatorBoardMetaDataQuery(1);
    // when
    const result = await getIndicatorBoardMetaDataQueryHandler.execute(testQuery);
    // then
    const expected = IndicatorBoardMetaData.createNew('메타데이터', { key1: ['1', '2', '3'] }, 1);
    expect(result).toEqual(expected);
  });
});

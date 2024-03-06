import { Test } from '@nestjs/testing';
import { GetHistoryIndicatorQueryHandler } from '../../../application/query/get-history-indicator/get-history-indicator.query.handler';
import { LoadHistoryIndicatorPort } from '../../../application/port/persistence/indicator/load-history-indicator.port';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CursorPageDto } from '../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../application/query/get-history-indicator/history-indicator.dto';
import { GetHistoryIndicatorQuery } from '../../../application/query/get-history-indicator/get-history-indicator.query';

describe('GetLiveIndicatorQueryHandler', () => {
  let getHistoryIndicatorQueryHandler: GetHistoryIndicatorQueryHandler;
  let loadHistoryIndicatorPort: LoadHistoryIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetHistoryIndicatorQueryHandler,
        {
          provide: 'LoadHistoryIndicatorPort',
          useValue: {
            loadHistoryIndicator: jest.fn().mockImplementation(() => {
              return CursorPageDto<HistoryIndicatorDto>;
            }),
          },
        },
      ],
    }).compile();

    getHistoryIndicatorQueryHandler = module.get(GetHistoryIndicatorQueryHandler);
    loadHistoryIndicatorPort = module.get('LoadHistoryIndicatorPort');
  }, 10000);

  it('변동지표를 불러온다.', async () => {
    //given
    const getHistoryIndicatorQuery: GetHistoryIndicatorQuery = new GetHistoryIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'day',
      19,
      '20240227',
    );

    //when
    await getHistoryIndicatorQueryHandler.execute(getHistoryIndicatorQuery);

    //then
    expect(loadHistoryIndicatorPort.loadHistoryIndicator).toHaveBeenCalledTimes(1);
  });
});

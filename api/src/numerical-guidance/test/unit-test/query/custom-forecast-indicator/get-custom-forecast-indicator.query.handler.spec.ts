import { Test } from '@nestjs/testing';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { GetCustomForecastIndicatorQuery } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query';
import { GetCustomForecastIndicatorQueryHandler } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';

describe('GetCustomForecastIndicatorQueryHandler', () => {
  let getCustomForecastIndicatorQueryHandler: GetCustomForecastIndicatorQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetCustomForecastIndicatorQueryHandler,
        {
          provide: 'LoadCustomForecastIndicatorPort',
          useValue: {
            loadCustomForecastIndicator: jest.fn().mockImplementation(() => {
              const data = CustomForecastIndicator.createNew('예측지표', {
                id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
                name: '타켓지표',
                type: 'Common Stock',
                index: 1234,
                country: 'KOREA',
                currency: 'KRW',
                mic_code: 'PINX',
                indicatorType: 'stocks',
                exchange: 'KOSPI',
                symbol: 'PPAL',
              });
              return data;
            }),
          },
        },
      ],
    }).compile();
    getCustomForecastIndicatorQueryHandler = module.get(GetCustomForecastIndicatorQueryHandler);
  }, 10000);

  it('예측지표 id를 가지고 예측지표를 가져온다.', async () => {
    // given
    const testQuery = new GetCustomForecastIndicatorQuery('예측지표 uuid');

    // when
    const result = await getCustomForecastIndicatorQueryHandler.execute(testQuery);

    // then
    const expectedName = '예측지표';
    const expectedTargetIndicatorId = '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1';
    expect(result.customForecastIndicatorName).toEqual(expectedName);
    expect(result.targetIndicator.id).toEqual(expectedTargetIndicatorId);
  });
});

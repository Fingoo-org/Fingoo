import { Test } from '@nestjs/testing';
import { GetCustomForecastIndicatorsByMemberIdQuery } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

describe('GetCustomForecastIndicatorsByMemberId', () => {
  let getCustomForecastIndicatorsByMemberIdQueryHandler: GetCustomForecastIndicatorsByMemberIdQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetCustomForecastIndicatorsByMemberIdQueryHandler,
        {
          provide: 'LoadCustomForecastIndicatorsByMemberIdPort',
          useValue: {
            loadCustomForecastIndicatorsByMemberId: jest.fn().mockImplementation(() => {
              const dataList = [
                CustomForecastIndicator.createNew('예측지표', {
                  targetIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
                  indicatorType: 'stock',
                  exchange: 'KOSPI',
                  symbol: 'PPAL',
                }),
              ];
              return dataList;
            }),
          },
        },
      ],
    }).compile();
    getCustomForecastIndicatorsByMemberIdQueryHandler = module.get(GetCustomForecastIndicatorsByMemberIdQueryHandler);
  }, 10000);

  it('사용자 id를 가지고 예측지표 리스트를 가져온다.', async () => {
    // given
    const testQuery = new GetCustomForecastIndicatorsByMemberIdQuery(1);

    // when
    const result = await getCustomForecastIndicatorsByMemberIdQueryHandler.execute(testQuery);

    // then
    const expected = [
      CustomForecastIndicator.createNew('예측지표', {
        targetIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
        indicatorType: 'stock',
        exchange: 'KOSPI',
        symbol: 'PPAL',
      }),
    ];
    expect(result[0].customForecastIndicatorName).toEqual(expected[0].customForecastIndicatorName);
  });
});

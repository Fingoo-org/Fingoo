import { Test } from '@nestjs/testing';
import { GetCustomForecastIndicatorValuesQuery } from 'src/numerical-guidance/application/query/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query';
import { GetCustomForecastIndicatorValuesQueryHandler } from 'src/numerical-guidance/application/query/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query.handler';
import { CustomForecastIndicatorValues } from 'src/utils/type/type-definition';

describe('GetCustomForecastIndicatorValuesQueryHandler', () => {
  let getCustomForecastIndicatorValuesQueryHandler: GetCustomForecastIndicatorValuesQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetCustomForecastIndicatorValuesQueryHandler,
        {
          provide: 'LoadCustomForecastIndicatorValuesPort',
          useValue: {
            loadCustomForecastIndicatorValues: jest.fn().mockImplementation(() => {
              const data: CustomForecastIndicatorValues = {
                name: '삼성전자',
                values: [
                  {
                    value: 50328.131,
                    date: '20230101',
                  },
                ],
              };
              return data;
            }),
          },
        },
      ],
    }).compile();
    getCustomForecastIndicatorValuesQueryHandler = module.get(GetCustomForecastIndicatorValuesQueryHandler);
  }, 10000);

  it('예측지표 id를 가지고 예측지표의 예측값을 불러온다.', async () => {
    // given
    const testQuery = new GetCustomForecastIndicatorValuesQuery('f17f53fd-41c1-4247-9636-50914afaad31');

    // when
    const result = await getCustomForecastIndicatorValuesQueryHandler.execute(testQuery);

    //then
    const expectedName = '삼성전자';
    const expectedValuesLength = 1;
    expect(result.name).toEqual(expectedName);
    expect(result.values.length).toEqual(expectedValuesLength);
  });
});

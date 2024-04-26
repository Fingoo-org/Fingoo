import { Test } from '@nestjs/testing';
import { GetCustomForecastIndicatorValuesQuery } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query';
import { GetCustomForecastIndicatorValuesQueryHandler } from 'src/numerical-guidance/application/query/custom-forecast-indicator/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query.handler';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorValuesResponse } from 'src/utils/type/type-definition';
import { liveIndicatorTestData } from '../../../data/liveIndicator.test.data';
import { Indicator, IndicatorDto } from 'src/numerical-guidance/application/query/indicator/basic/dto/indicator.dto';
import { LiveStockDto } from 'src/numerical-guidance/application/query/live-indicator/dto/live-stock.dto';
import { LoadIndicatorPort } from 'src/numerical-guidance/application/port/persistence/indicator/load-indicator.port';
import { LoadLiveIndicatorPort } from 'src/numerical-guidance/application/port/external/krx/load-live-indicator.port';
import { LoadCustomForecastIndicatorValuesPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';

const testForecastResponseData: CustomForecastIndicatorValuesResponse = {
  customForecastIndicatorId: '2c9846d1-d496-4d6d-96c5-d3b065708573',
  targetIndicatorId: '2c9846d1-d496-4d6d-96c5-d3b065708573',
  type: 'stocks',
  ticker: '373220',
  name: 'LG에너지솔루션',
  exchange: 'KOSPI',
  forecastType: 'single',
  customForecastIndicatorValues: [
    {
      value: '50328.131',
      date: '20230101',
    },
  ],
  targetIndicatorValues: [
    {
      value: '50328.124',
      date: '20230101',
    },
  ],
};

const testData = liveIndicatorTestData;

const testIndicator: Indicator = {
  id: '160e5499-4925-4e38-bb00-8ea6d8056484',
  name: '삼성전자',
  ticker: '005931',
  type: 'stocks',
  exchange: 'KOSPI',
};

describe('GetCustomForecastIndicatorValuesQueryHandler', () => {
  let getCustomForecastIndicatorValuesQueryHandler: GetCustomForecastIndicatorValuesQueryHandler;
  let loadCustomForecastIndicatorValuesPort: LoadCustomForecastIndicatorValuesPort;
  let loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort;
  let loadLiveIndicatorPort: LoadLiveIndicatorPort;
  let loadIndicatorPort: LoadIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetCustomForecastIndicatorValuesQueryHandler,
        {
          provide: 'LoadIndicatorPort',
          useValue: {
            loadIndicator: jest.fn().mockImplementation(() => {
              return IndicatorDto.create(testIndicator);
            }),
          },
        },
        {
          provide: 'LoadLiveIndicatorPort',
          useValue: {
            loadLiveIndicator: jest.fn().mockImplementation(() => {
              return LiveStockDto.create({ indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484', ...testData });
            }),
          },
        },
        {
          provide: 'LoadCustomForecastIndicatorPort',
          useValue: {
            loadCustomForecastIndicator: jest.fn().mockImplementation(() => {
              const customForecastIndicator: CustomForecastIndicator = new CustomForecastIndicator(
                '0d2bd0a1-3211-4f8c-8ed5-2a90fea30b1a',
                '예측지표',
                'customForecastIndicator',
                '160e5499-4925-4e38-bb00-8ea6d8056484',
                [],
                [],
                [],
              );
              return customForecastIndicator;
            }),
          },
        },
        {
          provide: 'LoadCustomForecastIndicatorValuesPort',
          useValue: {
            loadCustomForecastIndicatorValues: jest.fn().mockImplementation(() => {
              const data: CustomForecastIndicatorValuesResponse = testForecastResponseData;
              return data;
            }),
          },
        },
      ],
    }).compile();
    getCustomForecastIndicatorValuesQueryHandler = module.get(GetCustomForecastIndicatorValuesQueryHandler);
    loadCustomForecastIndicatorValuesPort = module.get('LoadCustomForecastIndicatorValuesPort');
    loadCustomForecastIndicatorPort = module.get('LoadCustomForecastIndicatorPort');
    loadIndicatorPort = module.get('LoadIndicatorPort');
    loadLiveIndicatorPort = module.get('LoadLiveIndicatorPort');
  }, 10000);

  it('예측지표 id를 가지고 예측지표의 예측값을 불러온다.', async () => {
    // given
    const testQuery = new GetCustomForecastIndicatorValuesQuery('0d2bd0a1-3211-4f8c-8ed5-2a90fea30b1a');

    // when
    await getCustomForecastIndicatorValuesQueryHandler.execute(testQuery);

    //then
    expect(loadCustomForecastIndicatorPort.loadCustomForecastIndicator).toHaveBeenCalledTimes(1);
    expect(loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues).toHaveBeenCalledTimes(1);
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(1);
  });
});

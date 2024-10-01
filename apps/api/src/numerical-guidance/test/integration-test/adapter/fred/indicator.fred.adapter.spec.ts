import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';
import { IndicatorFredAdapter } from '../../../../infrastructure/adapter/fred/indicator.fred.adapter';
import { FredApiManager } from '../../../../infrastructure/adapter/fred/util/fred-api.manager';
import { EconomyDto } from '../../../../application/query/indicator/get-indicator-list/dto/economy.dto';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorFredAdapter', () => {
  let indicatorFredAdapter: IndicatorFredAdapter;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 10000,
            maxRedirects: 5,
          }),
        }),
      ],
      providers: [IndicatorFredAdapter, FredApiManager],
    }).compile();
    indicatorFredAdapter = module.get(IndicatorFredAdapter);
  }, 80000);

  it('live 지표를 가져온다.', async () => {
    // given
    const indicatorDto: EconomyDto = {
      id: '9493336a-2a81-473d-98e4-a7a682cf176f',
      index: 16,
      indicatorType: 'economy',
      symbol: 'GNPCA',
      name: 'Real Gross National Product',
      frequency: 'Annual',
      frequency_short: 'A',
      units: 'Billions of Chained 2017 Dollars',
      units_short: 'Bil. of Chn. 2017 $',
      seasonal_adjustment: 'Not Seasonally Adjusted',
      seasonal_adjustment_short: 'NSA',
      notes: 'BEA Account Code: A001RX\n\n',
    };

    // when
    const result: LiveIndicatorDtoType = await indicatorFredAdapter.loadLiveIndicator(
      indicatorDto,
      'none',
      '2001-01-01',
      '2024-05-30',
    );

    // then
    const expectedFieldCount = 7;
    const actualFieldCount = Object.keys(result).length;
    expect(actualFieldCount).toEqual(expectedFieldCount);

    const expectedFields = ['indicatorId', 'symbol', 'interval', 'type', 'name', 'totalCount', 'values'];
    expectedFields.forEach((field) => {
      expect(result).toHaveProperty(field);
    });
  }, 15000);
});

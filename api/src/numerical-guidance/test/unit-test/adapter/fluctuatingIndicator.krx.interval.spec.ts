import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';

describe('FluctuatingIndicatorKrxIntervalAdapter', () => {
  let fluctuatingIndicatorKrxAdapter: FluctuatingIndicatorKrxAdapter;

  beforeEach(async () => {
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
      providers: [FluctuatingIndicatorKrxAdapter],
    }).compile();
    fluctuatingIndicatorKrxAdapter = module.get(FluctuatingIndicatorKrxAdapter);
  });

  it('간격을 일주일로 입력할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const ResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      30,
      '005930',
      'week',
      'KOSPI',
      '20240125',
    );

    const expected: string[] = ['74766.67', '72780.00', '74220.00', '77450.00', '77700.00', '74400.00', '73140.00'];

    // then
    for (let i = 0; i < ResponseData.items.item.length; i++) {
      expect(ResponseData.items.item[i]['weeklyAverage']).toEqual(expected[i]);
    }
  });

  it('간격을 한달로 설정할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const ResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      100,
      '005930',
      'month',
      'KOSPI',
      '20240125',
    );

    const expected: string[] = ['74652.94', '73810.53', '71409.09', '67910.53', '70168.42', '66900.00'];

    // then
    for (let i = 0; i < ResponseData.items.item.length; i++) {
      expect(ResponseData.items.item[i]['monthlyAverage']).toEqual(expected[i]);
    }
  });

  it('간격을 일년으로 설정할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const ResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      500,
      '005930',
      'year',
      'KOSPI',
      '20240125',
    );

    const expected: string[] = ['74652.94', '67457.14', '63455.46'];

    // then
    for (let i = 0; i < ResponseData.items.item.length; i++) {
      expect(ResponseData.items.item[i]['yearlyAverages']).toEqual(expected[i]);
    }
  });
});

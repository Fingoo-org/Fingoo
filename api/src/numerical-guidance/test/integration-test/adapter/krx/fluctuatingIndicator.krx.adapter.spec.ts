import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { fluctuatingIndicatorTestData } from 'src/numerical-guidance/test/data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('FluctuatingIndicatorKrxAdapter', () => {
  let fluctuatingIndicatorKrxAdapter: FluctuatingIndicatorKrxAdapter;

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
      providers: [FluctuatingIndicatorKrxAdapter],
    }).compile();
    fluctuatingIndicatorKrxAdapter = module.get(FluctuatingIndicatorKrxAdapter);
  });

  it('캐시 없이 외부 데이터 가져오기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      5,
      '005930',
      'day',
      'KOSPI',
      '20240125',
    );

    const result: string = responseData.items.item[0]['srtnCd'];

    // then
    const expected: string = FluctuatingIndicatorDto.create(testData).items.item[0]['srtnCd'];
    expect(result).toEqual(expected);
  });

  it('지표 데이터를 100개 요청했을 경우, 올바르게 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      100,
      '005930',
      'day',
      'KOSPI',
      '20240125',
    );

    const result: number = responseData.items.item.length;

    // then
    const expected: number = 100;
    expect(result).toEqual(expected);
  });

  it('KOSDAQ 종목의 지표 데이터를 요청할 경우, 올바르게 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      7,
      '900110',
      'day',
      'KOSDAQ',
      '20240125',
    );

    const result: string = responseData.items.item[0]['mrktCtg'];

    // then
    const expected: string = 'KOSDAQ';
    expect(result).toEqual(expected);
  });

  it('간격을 일주일로 입력할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const ResponseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
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
    const ResponseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
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
    const ResponseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
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

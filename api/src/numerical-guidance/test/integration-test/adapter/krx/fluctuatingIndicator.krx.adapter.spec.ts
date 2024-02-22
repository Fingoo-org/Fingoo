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

  it('krx에서 지표를 가져온다.', async () => {
    // given
    // when
    const responseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      5,
      '005930',
      'day',
      'KOSPI',
      '20240125',
    );
    const result: string = responseData['ticker'];
    // then
    const expected: string = FluctuatingIndicatorDto.create(testData)['ticker'];
    expect(result).toEqual(expected);
  }, 15000);

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
    const result: string = responseData['market'];
    // then
    const expected: string = 'KOSDAQ';
    expect(result).toEqual(expected);
  }, 15000);

  it('krx response Data를 생성한다.', async () => {
    // given
    // when
    const responseData: FluctuatingIndicatorDto = await fluctuatingIndicatorKrxAdapter.createKRXResponseData(
      7,
      '900110',
      'KOSDAQ',
      '20240118',
      '20240125',
    );
    const result: string = responseData['market'];
    // then
    const expected: string = 'KOSDAQ';
    expect(result).toEqual(expected);
  }, 15000);
});

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LiveIndicatorDto } from 'src/numerical-guidance/application/query/get-live-indicator/live-indicator.dto';
import { LiveIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/live-indicator.krx.adapter';
import { liveIndicatorTestData } from 'src/numerical-guidance/test/data/liveIndicator.test.data';
import { AdjustIndicatorValue } from '../../../../util/adjust-indicator-value';

const testData = liveIndicatorTestData;

describe('FluctuatingIndicatorKrxAdapter', () => {
  let liveIndicatorKrxAdapter: LiveIndicatorKrxAdapter;
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
      providers: [
        LiveIndicatorKrxAdapter,
        {
          provide: 'IndicatorValueManager',
          useClass: AdjustIndicatorValue,
        },
      ],
    }).compile();
    liveIndicatorKrxAdapter = module.get(LiveIndicatorKrxAdapter);
  });

  it('krx에서 live 지표를 가져온다.', async () => {
    // given
    const indicatorId: string = '160e5499-4925-4e38-bb00-8ea6d8056484';

    // when
    const responseData: LiveIndicatorDto = await liveIndicatorKrxAdapter.loadLiveIndicator(
      indicatorId,
      '005930',
      'day',
      'KOSPI',
    );
    const result: string = responseData['ticker'];
    // then
    const expected: string = LiveIndicatorDto.create({ indicatorId, ...testData })['ticker'];
    expect(result).toEqual(expected);
  }, 15000);

  it('KOSDAQ 종목의 지표 데이터를 요청할 경우, 올바르게 데이터를 가져오는지 확인하기', async () => {
    // given
    const indicatorId: string = '160e5499-4925-4e38-bb00-8ea6d8056484';

    // when
    const responseData: LiveIndicatorDto = await liveIndicatorKrxAdapter.loadLiveIndicator(
      indicatorId,
      '900110',
      'day',
      'KOSDAQ',
    );
    const result: string = responseData['market'];
    // then
    const expected: string = 'KOSDAQ';
    expect(result).toEqual(expected);
  }, 15000);

  it('krx response Data를 생성한다.', async () => {
    // given
    const indicatorId: string = '160e5499-4925-4e38-bb00-8ea6d8056484';

    // when
    const responseData: LiveIndicatorDto = await liveIndicatorKrxAdapter.createKRXResponseData(
      7,
      indicatorId,
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

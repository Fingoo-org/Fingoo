import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { fluctuatingIndicatorTestData } from 'src/numerical-guidance/test/data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('FluctuatingIndicatorKrxAdapter', () => {
  let fluctuatingIndicatorKrxAdapter: FluctuatingIndicatorKrxAdapter;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 5000,
            maxRedirects: 5,
          }),
        }),
      ],
      providers: [
        FluctuatingIndicatorKrxAdapter,
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useClass: FluctuatingIndicatorKrxAdapter,
        },
      ],
    }).compile();
    fluctuatingIndicatorKrxAdapter = module.get(FluctuatingIndicatorKrxAdapter);
  });

  it('캐시 없이 외부 데이터 가져오기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      5,
      '005930',
      'KOSPI',
    );

    const result: string = responseData.items.item[0]['srtnCd'];

    // then
    const expected: string = FluctuatingIndicatorsDto.create(testData).items.item[0]['srtnCd'];
    expect(result).toEqual(expected);
  });
});

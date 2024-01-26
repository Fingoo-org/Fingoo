import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { FluctuatingIndicatorKrxAdapter } from 'src/numerical-guidance/infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { fluctuatingIndicatorTestData } from 'src/numerical-guidance/test/data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

function getISOWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNumber;
}

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
    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      5,
      '005930',
      'day',
      'KOSPI',
    );

    const result: string = responseData.items.item[0]['srtnCd'];

    // then
    const expected: string = FluctuatingIndicatorsDto.create(testData).items.item[0]['srtnCd'];
    expect(result).toEqual(expected);
  });

  it('지표 데이터를 100개 요청했을 경우, 올바르게 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      100,
      '005930',
      'day',
      'KOSPI',
    );

    const result: number = responseData.items.item.length;

    // then
    const expected: number = 100;
    expect(result).toEqual(expected);
  });

  it('KOSDAQ 종목의 지표 데이터를 요청할 경우, 올바르게 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      7,
      '900110',
      'day',
      'KOSDAQ',
    );

    const result: string = responseData.items.item[0]['mrktCtg'];

    // then
    const expected: string = 'KOSDAQ';
    expect(result).toEqual(expected);
  });

  it('간격을 일주일로 입력할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const dayResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      30,
      '005930',
      'day',
      'KOSPI',
    );

    const items = dayResponseData.items.item;
    const processedWeeks = new Set();
    const expectedDatas = [];

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
      const weeklyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameWeek =
          currentDate.getFullYear() === itemDate.getFullYear() &&
          getISOWeekNumber(currentDate) === getISOWeekNumber(itemDate);

        return isSameWeek;
      });

      if (weeklyItems.length > 0) {
        const weekIdentifier = `${currentDate.getFullYear()}-${getISOWeekNumber(currentDate)}`;

        if (!processedWeeks.has(weekIdentifier)) {
          const weeklyClprSum = weeklyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
          const weeklyAverage = weeklyClprSum / weeklyItems.length;
          expectedDatas.push(weeklyAverage.toFixed(2));
        }

        processedWeeks.add(weekIdentifier);
      }
    }

    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      30,
      '005930',
      'week',
      'KOSPI',
    );

    // then
    for (let i = 0; i < responseData.items.item.length; i++) {
      const result: string = responseData.items.item[i]['weeklyAverage'];
      expect(result).toEqual(expectedDatas[i]);
    }
  });

  it('간격을 한달로 설정할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const dayResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      100,
      '005930',
      'day',
      'KOSPI',
    );

    const items = dayResponseData.items.item;
    const processedMonths = new Set();
    const expectedDatas = [];

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const monthlyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameMonth =
          currentDate.getFullYear() === itemDate.getFullYear() && currentDate.getMonth() === itemDate.getMonth();

        return isSameMonth;
      });

      if (monthlyItems.length > 0) {
        const monthIdentifier = currentDate.getMonth();

        if (!processedMonths.has(monthIdentifier)) {
          const monthIdentifier = currentDate.getMonth();

          if (!processedMonths.has(monthIdentifier)) {
            const monthlyClprSum = monthlyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
            const monthlyAverage = monthlyClprSum / monthlyItems.length;

            expectedDatas.push(monthlyAverage.toFixed(2));
          }
          processedMonths.add(monthIdentifier);
        }
      }
    }

    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      100,
      '005930',
      'month',
      'KOSPI',
    );

    // then
    for (let i = 0; i < responseData.items.item.length; i++) {
      const result: string = responseData.items.item[i]['monthlyAverage'];
      expect(result).toEqual(expectedDatas[i]);
    }
  });

  it('간격을 일년으로 설정할 경우, 올바른 데이터를 가져오는지 확인하기', async () => {
    // given

    // when
    const dayResponseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      500,
      '005930',
      'day',
      'KOSPI',
    );

    const items = dayResponseData.items.item;
    const expectedDatas = [];
    const processedYears = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const yearlyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameYear = currentDate.getFullYear() === itemDate.getFullYear();

        return isSameYear;
      });
      if (yearlyItems.length > 0) {
        const yearIdentifier = currentDate.getFullYear();

        if (!processedYears.has(yearIdentifier)) {
          const yearlyClprSum = yearlyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
          const yearlyAverage = yearlyClprSum / yearlyItems.length;

          expectedDatas.push(yearlyAverage.toFixed(2));
        }
        processedYears.add(yearIdentifier);
      }
    }

    const responseData: FluctuatingIndicatorsDto = await fluctuatingIndicatorKrxAdapter.loadFluctuatingIndicator(
      500,
      '005930',
      'year',
      'KOSPI',
    );

    // then
    for (let i = 0; i < responseData.items.item.length; i++) {
      const result: string = responseData.items.item[i]['yearlyAverages'];
      expect(result).toEqual(expectedDatas[i]);
    }
  });
});

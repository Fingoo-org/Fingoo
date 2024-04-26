import { LiveStockDto } from 'src/numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import * as fs from 'fs';
import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import { IndicatorValue, Interval } from '../../../utils/type/type-definition';
import { StockDto } from '../../application/query/indicator/get-indicator-list/dto/stock.dto';

const filePath = './src/numerical-guidance/test/data/liveIndicatorIntervalTestData.json';

const data = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(data);
const rawItems = jsonData.values;

const items = [];
for (let i = 0; i < rawItems.length; i++) {
  const { datetime, close } = rawItems[i];

  items.push({
    date: datetime,
    value: close,
  });
}

const indicatorDto: StockDto = {
  id: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
  index: 1,
  symbol: 'AAPL',
  indicatorType: 'stocks',
  name: 'Apple Inc',
  currency: 'USD',
  exchange: 'NASDAQ',
  mic_code: 'XNGS',
  country: 'United States',
  type: 'Common Stock',
};

const dailyTestData = LiveStockDto.create({
  indicatorId: indicatorDto.id,
  type: indicatorDto.indicatorType,
  symbol: indicatorDto.symbol,
  name: indicatorDto.name,
  exchange: indicatorDto.exchange,
  totalCount: 24,
  values: items,
});

describe('AdjustIndicatorValue', () => {
  beforeEach(async () => {});

  it('interval을 week로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    // given
    const interval: Interval = 'week';

    // when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(dailyTestData.values, interval);

    const weeklyAverages = result.map((item) => item['value']);

    // then
    const expected: string[] = ['172.546000', '170.814002', '181.124000', '182.692502', '184.501994'];

    expect(weeklyAverages).toEqual(expected);
  });

  it('interval을 month로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    // given
    const interval: Interval = 'month';
    // when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(dailyTestData.values, interval);

    const monthlyAverages = result.map((item) => item['value']);
    // then
    const expected: string[] = ['172.405455', '183.018460'];
    expect(monthlyAverages).toEqual(expected);
  });

  it('interval을 year로 설정했을 경우 데이터를 잘 변환하는지 확인', async () => {
    //given
    const interval = 'year';

    //when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.adjustValuesByInterval(dailyTestData.values, interval);

    const yearlyAverages = result.map((item) => item['value']);
    // then
    const expected: string[] = ['178.154166'];
    expect(yearlyAverages).toEqual(expected);
  });
});

import { LiveStockDto } from 'src/numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import * as fs from 'fs';
import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import { IndicatorValue } from '../../../utils/type/type-definition';
import { StockDto } from '../../application/query/indicator/get-indicator-list/dto/stock.dto';

const filePath = './src/numerical-guidance/test/data/liveIndicatorTestDataPerMonth.json';

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

  it('month values를 year로 변환', async () => {
    //given //when
    const adjustIndicatorValue = new AdjustIndicatorValue();
    const result: IndicatorValue[] = await adjustIndicatorValue.convertIndicatorValueMonthToYear(dailyTestData.values);

    const yearlyAverages = result.map((item) => item['value']);
    // then
    const expected: string[] = ['176.482497', '175.523332', '153.912498', '141.688337', '97.094583'];
    expect(yearlyAverages).toEqual(expected);
  });
});

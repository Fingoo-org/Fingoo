import { Seeder } from 'typeorm-extension';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { DataSource } from 'typeorm';
import { HistoryIndicatorEntity } from '../../../numerical-guidance/infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import * as fs from 'fs';
import { HistoryIndicatorValueEntity } from '../../../numerical-guidance/infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';

export default class IndicatorEntitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(IndicatorEntity).clear();
    await dataSource.getRepository(IndicatorEntity).insert([
      {
        name: '삼성전자',
        ticker: '005930',
        type: 'k-stock',
        market: 'KOSPI',
      },
      {
        name: '이스트아시아',
        ticker: '900110',
        type: 'k-stock',
        market: 'KOSDAQ',
      },
    ]);

    const indicatorEntity = await dataSource.getRepository(IndicatorEntity).findOneBy({ ticker: '005930' });

    await dataSource.getRepository(HistoryIndicatorEntity).insert({
      id: indicatorEntity.id,
      name: indicatorEntity.name,
      type: indicatorEntity.type,
      ticker: indicatorEntity.ticker,
      market: indicatorEntity.market,
      values: [],
    });

    const historyIndicatorEntity: HistoryIndicatorEntity = await dataSource
      .getRepository(HistoryIndicatorEntity)
      .findOneBy({ id: indicatorEntity.id });

    const filePath = './src/utils/database/mock-history-indicator.json';

    const data = fs.readFileSync(filePath, 'utf8');

    const mockHistoryIndicatorValues = JSON.parse(data);

    const historyIndicatorValues = mockHistoryIndicatorValues.map((value) => {
      return {
        date: new Date(value.date),
        close: value.close,
        compare: value.compare,
        fluctuation: value.fluctuation,
        open: value.open,
        high: value.high,
        low: value.low,
        volume: value.volume,
        tradingValue: value.tradingValue,
        marketCapitalization: value.marketCapitalization,
        outstandingShares: value.outstandingShares,
      };
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).insert(historyIndicatorValues);
    const historyIndicatorValueEntities = await dataSource.getRepository(HistoryIndicatorValueEntity).find();
    historyIndicatorValueEntities.forEach((entity) => {
      entity.historyIndicator = historyIndicatorEntity;
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).save(historyIndicatorValueEntities);
  }
}

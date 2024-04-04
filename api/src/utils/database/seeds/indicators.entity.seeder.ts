import { Seeder } from 'typeorm-extension';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { DataSource } from 'typeorm';
import { HistoryIndicatorEntity } from '../../../numerical-guidance/infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import * as fs from 'fs';
import { HistoryIndicatorValueEntity } from '../../../numerical-guidance/infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';

export default class IndicatorEntitySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(IndicatorEntity).clear();
    const companies = [
      {
        name: '삼성전자',
        ticker: '005930',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'SK하이닉스',
        ticker: '000660',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '네이버',
        ticker: '035420',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'LG에너지솔루션',
        ticker: '373220',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '기아',
        ticker: '000270',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '현대차',
        ticker: '005380',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '카카오',
        ticker: '035720',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'LG',
        ticker: '003550',
        type: 'stocks',
        market: 'KOSPI',
      },
    ];

    await dataSource.getRepository(IndicatorEntity).insert([
      {
        name: '삼성전자',
        ticker: '005930',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'SK하이닉스',
        ticker: '000660',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '네이버',
        ticker: '035420',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'LG에너지솔루션',
        ticker: '373220',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '기아',
        ticker: '000270',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '현대차',
        ticker: '005380',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: '카카오',
        ticker: '035720',
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        name: 'LG',
        ticker: '003550',
        type: 'stocks',
        market: 'KOSPI',
      },
    ]);

    let historyIndicatorEntity: HistoryIndicatorEntity;
    let historyDataPath: string;
    let historyData: string;
    let mockHistoryIndicatorValues;
    for (const company of companies) {
      const indicatorEntity = await dataSource.getRepository(IndicatorEntity).findOneBy({ ticker: company.ticker });
      console.log(indicatorEntity.name, '저장 중...');
      await dataSource.getRepository(HistoryIndicatorEntity).insert({
        id: indicatorEntity.id,
        name: indicatorEntity.name,
        type: indicatorEntity.type,
        ticker: indicatorEntity.ticker,
        market: indicatorEntity.market,
        values: [],
      });

      historyDataPath = `./src/utils/database/mock-history-indicator/mock-indicator-${company.name}.json`;
      historyData = fs.readFileSync(historyDataPath, 'utf8');
      mockHistoryIndicatorValues = JSON.parse(historyData);

      historyIndicatorEntity = await dataSource
        .getRepository(HistoryIndicatorEntity)
        .findOneBy({ id: indicatorEntity.id });

      await mockHistoryIndicatorValues.map((value) => {
        const entity = new HistoryIndicatorValueEntity();
        entity.date = new Date(value.date);
        entity.close = value.close;
        entity.compare = value.compare;
        entity.fluctuation = value.fluctuation;
        entity.open = value.open;
        entity.high = value.high;
        entity.low = value.low;
        entity.volume = value.volume;
        entity.tradingValue = value.tradingValue;
        entity.marketCapitalization = value.marketCapitalization;
        entity.outstandingShares = value.outstandingShares;
        entity.historyIndicator = historyIndicatorEntity;
        dataSource.getRepository(HistoryIndicatorValueEntity).save(entity);
      });
      console.log(indicatorEntity.name, '저장 완료!');
    }
  }
}

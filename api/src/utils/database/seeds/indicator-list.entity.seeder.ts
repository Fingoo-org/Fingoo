import { Seeder } from 'typeorm-extension';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator-list/entity/indicator.entity';
import { DataSource } from 'typeorm';

export default class IndicatorEntitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(IndicatorEntity).clear();
    await dataSource.getRepository(IndicatorEntity).insert([
      {
        id: 1,
        name: '삼성전자',
        ticker: '005930',
        type: 'k-stock',
        market: 'KOSPI',
      },
      {
        id: 2,
        name: '이스트아시아',
        ticker: '900110',
        type: 'k-stock',
        market: 'KOSDAQ',
      },
    ]);
  }
}

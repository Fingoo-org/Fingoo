import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/indicator-list/entity/indicator.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('MYSQL_USER'),
  password: configService.get<string>('MYSQL_PASSWORD'),
  database: configService.get<string>('MYSQL_DATABASE'),
  // entities: ['dist/**/**/*.entity.{ts,js}'],
  entities: [IndicatorEntity],
  synchronize: true,
});

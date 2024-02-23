import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_USER'),
  entities: ['src/**/*.entity.{ts,js}'],
  logging: false,
  synchronize: true,
  seeds: ['src/utils/database/seeds/**/*{.ts,.js}'],
};

export default new DataSource(options);

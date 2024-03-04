import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { CustomForecastIndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CustomForecastIndicatorPersistentAdapter', () => {
  let environment;
  let customForecastIndicatorPersistentAdapter: CustomForecastIndicatorPersistentAdapter;

  beforeEach(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forFeature([CustomForecastIndicatorEntity]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            type: 'postgres',
            retryAttempts: 20,
            retryDelay: 5000,
            host: environment.getHost(),
            port: environment.getPort(),
            username: environment.getUsername(),
            password: environment.getPassword(),
            database: environment.getDatabase(),
            entities: [CustomForecastIndicatorEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [CustomForecastIndicatorPersistentAdapter],
    }).compile();
    customForecastIndicatorPersistentAdapter = module.get(CustomForecastIndicatorPersistentAdapter);
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('예측지표 생성하고 생성한 id로 예측지표 확인', async () => {
    // given
    const customForecastIndicator: CustomForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      '목표지표 uuid',
    );

    // when
    const resultId =
      await customForecastIndicatorPersistentAdapter.createCustomForecastIndicator(customForecastIndicator);
    const resultCustomForecastIndicator: CustomForecastIndicator =
      await customForecastIndicatorPersistentAdapter.loadCustomForecastIndicator(resultId);

    // then
    expect(customForecastIndicator.customForecastIndicatorName).toEqual(
      resultCustomForecastIndicator.customForecastIndicatorName,
    );
  });

  it('예측지표 id로 예측지표 불러오기 - db에 존재하지 않을 경우', async () => {
    // given
    const invalidId = 'a46240d3-7d15-48e7-a9b7-f490bf9ca6e3';

    //when
    //then
    await expect(async () => {
      await customForecastIndicatorPersistentAdapter.loadCustomForecastIndicator(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 예측지표를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });
});

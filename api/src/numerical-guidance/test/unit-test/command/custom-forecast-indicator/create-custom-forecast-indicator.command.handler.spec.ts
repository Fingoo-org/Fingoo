import { CreateCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CreateCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CreateCustomForecastIndicatorCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CreateCustomForecastIndicatorCommandHandler', () => {
  let createCustomForecastIndicatorCommandHandler: CreateCustomForecastIndicatorCommandHandler;
  let createCustomForecastIndicatorPort: CreateCustomForecastIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        CreateCustomForecastIndicatorCommandHandler,
        {
          provide: 'CreateCustomForecastIndicatorPort',
          useValue: {
            createCustomForecastIndicator: jest.fn().mockImplementation(() => {
              const testData = new CustomForecastIndicator(
                '008628f5-4dbd-4c3b-b793-ca0fa22b3cfa',
                'name',
                'customForecastIndicator',
                {
                  targetIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
                  targetIndicatorName: '타겟 지표',
                  indicatorType: 'stocks',
                  exchange: 'KOSPI',
                  symbol: 'PPAL',
                },
                [],
                [],
                [],
              );
              const testDataId = testData.id;
              return testDataId;
            }),
          },
        },
      ],
    }).compile();

    createCustomForecastIndicatorCommandHandler = module.get(CreateCustomForecastIndicatorCommandHandler);
    createCustomForecastIndicatorPort = module.get('CreateCustomForecastIndicatorPort');
  }, 10000);

  it('예측 지표를 생성한다', async () => {
    // given
    const command: CreateCustomForecastIndicatorCommand = new CreateCustomForecastIndicatorCommand(
      '예측지표',
      '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
      'stocks',
      1,
    );

    // when
    const customForecastIndicatorId: string = await createCustomForecastIndicatorCommandHandler.execute(command);

    // then
    expect(customForecastIndicatorId).toEqual('008628f5-4dbd-4c3b-b793-ca0fa22b3cfa');
    expect(createCustomForecastIndicatorPort.createCustomForecastIndicator).toHaveBeenCalledTimes(1);
  });
});

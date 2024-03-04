import { CreateCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CreateCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CreateCustomForecastIndicatorCommand } from 'src/numerical-guidance/application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command';
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
            createCustomForecastIndicator: jest.fn(),
          },
        },
      ],
    }).compile();

    createCustomForecastIndicatorCommandHandler = module.get(CreateCustomForecastIndicatorCommandHandler);
    createCustomForecastIndicatorPort = module.get('CreateCustomForecastIndicatorPort');
  }, 10000);

  it('예측 지표를 생성한다', async () => {
    // given
    const command: CreateCustomForecastIndicatorCommand = new CreateCustomForecastIndicatorCommand('예측지표', 'uuid');

    // when
    const customForecastIndicator: CustomForecastIndicator =
      await createCustomForecastIndicatorCommandHandler.execute(command);

    // then
    expect(customForecastIndicator.customForecastIndicatorName).toEqual('예측지표');
    expect(customForecastIndicator.grangerVerification.length).toBe(0);
    expect(createCustomForecastIndicatorPort.createCustomForecastIndicator).toHaveBeenCalledTimes(1);
  });
});

import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UpdateSourceIndicatorsAndWeightsCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-and-weights.command.handler';
import { UpdateSourceIndicatorsAndWeightsPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-source-indicators-and-weights.port';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { UpdateSourceIndicatorsAndWeightsCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-and-weights.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateSourceIndicatorsAndWeightsCommandHandler', () => {
  let updateSourceIndicatorsAndWeightsCommandHandler: UpdateSourceIndicatorsAndWeightsCommandHandler;
  let updateSourceIndicatorsAndWeightsPort: UpdateSourceIndicatorsAndWeightsPort;
  let loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UpdateSourceIndicatorsAndWeightsCommandHandler,
        {
          provide: 'UpdateSourceIndicatorsAndWeightsPort',
          useValue: {
            updateSourceIndicatorsAndWeights: jest.fn(),
          },
        },
        {
          provide: 'LoadCustomForecastIndicatorPort',
          useValue: {
            loadCustomForecastIndicator: jest.fn().mockImplementation(() => {
              return new CustomForecastIndicator('id', 'name', 'customForecastIndicator', 'targetId', [], [], []);
            }),
          },
        },
      ],
    }).compile();
    updateSourceIndicatorsAndWeightsCommandHandler = module.get(UpdateSourceIndicatorsAndWeightsCommandHandler);
    updateSourceIndicatorsAndWeightsPort = module.get('UpdateSourceIndicatorsAndWeightsPort');
    loadCustomForecastIndicatorPort = module.get('LoadCustomForecastIndicatorPort');
  }, 10000);
  it('예측지표에 indicatorId와 weight를 추가한다.', async () => {
    const command: UpdateSourceIndicatorsAndWeightsCommand = new UpdateSourceIndicatorsAndWeightsCommand(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      [
        {
          weight: 'none',
          sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120011',
        },
        {
          weight: '0.07/8',
          sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120021',
        },
      ],
    );

    // when
    await updateSourceIndicatorsAndWeightsCommandHandler.execute(command);

    // then
    expect(loadCustomForecastIndicatorPort.loadCustomForecastIndicator).toHaveBeenCalledTimes(1);
    expect(updateSourceIndicatorsAndWeightsPort.updateSourceIndicatorsAndWeights).toHaveBeenCalledTimes(1);
  });
});

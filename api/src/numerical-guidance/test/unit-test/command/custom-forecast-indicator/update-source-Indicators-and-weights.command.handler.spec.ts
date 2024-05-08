import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UpdateSourceIndicatorsInformationCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-information.command.handler';
import { UpdateSourceIndicatorsInformationPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-source-indicators-information.port';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { UpdateSourceIndicatorsInformationCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-informations.command';
import { LoadIndicatorPort } from 'src/numerical-guidance/application/port/persistence/indicator/load-indicator.port';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateSourceIndicatorsAndWeightsCommandHandler', () => {
  let updateSourceIndicatorsInformationCommandHandler: UpdateSourceIndicatorsInformationCommandHandler;
  let updateSourceIndicatorsInformationPort: UpdateSourceIndicatorsInformationPort;
  let loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort;
  let loadIndicatorPort: LoadIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UpdateSourceIndicatorsInformationCommandHandler,
        {
          provide: 'UpdateSourceIndicatorsInformationPort',
          useValue: {
            updateSourceIndicatorsInformation: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorPort',
          useValue: {
            loadIndicator: jest.fn().mockImplementation(() => {
              const stockDto = {
                id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
                index: 1,
                indicatorType: 'stocks',
                symbol: 'AAAA',
                name: '타겟 지표',
                country: 'korea',
                currency: 'currency',
                exchange: 'KOSPI',
                mic_code: 'mic_code',
                type: 'type',
              };
              return stockDto;
            }),
          },
        },
        {
          provide: 'LoadCustomForecastIndicatorPort',
          useValue: {
            loadCustomForecastIndicator: jest.fn().mockImplementation(() => {
              return new CustomForecastIndicator(
                'id',
                'name',
                'customForecastIndicator',
                {
                  id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf2',
                  name: '타켓지표',
                  type: 'Common Stock',
                  index: 1234,
                  country: 'KOREA',
                  currency: 'KRW',
                  mic_code: 'PINX',
                  indicatorType: 'stocks',
                  exchange: 'KOSPI',
                  symbol: 'PPAL',
                },
                [],
                [],
                [],
              );
            }),
          },
        },
      ],
    }).compile();
    updateSourceIndicatorsInformationCommandHandler = module.get(UpdateSourceIndicatorsInformationCommandHandler);
    updateSourceIndicatorsInformationPort = module.get('UpdateSourceIndicatorsInformationPort');
    loadCustomForecastIndicatorPort = module.get('LoadCustomForecastIndicatorPort');
    loadIndicatorPort = module.get('LoadIndicatorPort');
  }, 10000);
  it('예측지표에 재료 지표 정보를 추가한다.', async () => {
    const command: UpdateSourceIndicatorsInformationCommand = new UpdateSourceIndicatorsInformationCommand(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      [
        {
          sourceIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf2',
          indicatorType: 'stocks',
          weight: 10,
        },
      ],
    );

    // when
    await updateSourceIndicatorsInformationCommandHandler.execute(command);

    // then
    expect(loadCustomForecastIndicatorPort.loadCustomForecastIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(1);
    expect(updateSourceIndicatorsInformationPort.updateSourceIndicatorsInformation).toHaveBeenCalledTimes(1);
  });

  it('예측지표에 재료지표를 적용하지 않는다.', async () => {
    const command: UpdateSourceIndicatorsInformationCommand = new UpdateSourceIndicatorsInformationCommand(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      [],
    );

    // when
    await updateSourceIndicatorsInformationCommandHandler.execute(command);

    // then
    expect(loadCustomForecastIndicatorPort.loadCustomForecastIndicator).toHaveBeenCalledTimes(1);
    expect(updateSourceIndicatorsInformationPort.updateSourceIndicatorsInformation).toHaveBeenCalledTimes(1);
  });
});

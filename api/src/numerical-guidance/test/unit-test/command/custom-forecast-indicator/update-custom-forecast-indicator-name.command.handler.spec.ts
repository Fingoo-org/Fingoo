import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UpdateCustomForecastIndicatorNameCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command.handler';
import { UpdateCustomForecastIndicatorNamePort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-custom-forecast-indicator-name.port';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { UpdateCustomForecastIndicatorNameCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateCustomForecastIndicatorNameCommandHandler', () => {
  let updateCustomForecastIndicatorNameCommandHandler: UpdateCustomForecastIndicatorNameCommandHandler;
  let updateCustomForecastIndicatorNamePort: UpdateCustomForecastIndicatorNamePort;
  let loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UpdateCustomForecastIndicatorNameCommandHandler,
        {
          provide: 'UpdateCustomForecastIndicatorNamePort',
          useValue: {
            updateCustomForecastIndicatorName: jest.fn(),
          },
        },
        {
          provide: 'LoadCustomForecastIndicatorPort',
          useValue: {
            loadCustomForecastIndicator: jest.fn().mockImplementation(() => {
              return new CustomForecastIndicator(
                '294612ba-9c7f-46a9-bc0c-272a5ec2b799',
                'name',
                'customForecastIndicator',
                {
                  targetIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
                  indicatorType: 'stock',
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

    updateCustomForecastIndicatorNameCommandHandler = module.get(UpdateCustomForecastIndicatorNameCommandHandler);
    updateCustomForecastIndicatorNamePort = module.get('UpdateCustomForecastIndicatorNamePort');
    loadCustomForecastIndicatorPort = module.get('LoadCustomForecastIndicatorPort');
  }, 10000);

  it('예측지표의 이름을 수정한다.', async () => {
    // given
    const command: UpdateCustomForecastIndicatorNameCommand = new UpdateCustomForecastIndicatorNameCommand(
      '294612ba-9c7f-46a9-bc0c-272a5ec2b799',
      '수정할 이름',
    );

    // when
    await updateCustomForecastIndicatorNameCommandHandler.execute(command);

    // then
    expect(loadCustomForecastIndicatorPort.loadCustomForecastIndicator).toHaveBeenCalledTimes(1);
    expect(updateCustomForecastIndicatorNamePort.updateCustomForecastIndicatorName).toHaveBeenCalledTimes(1);
  });
});

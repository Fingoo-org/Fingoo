import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DeleteCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command.handler';
import { DeleteCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/delete-custom-forecast-indicator.port';
import { DeleteCustomForecastIndicatorCommand } from 'src/numerical-guidance/application/command/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('DeleteCustomForecastIndicatorCommandHandler', () => {
  let deleteCustomForecastIndicatorCommandHandler: DeleteCustomForecastIndicatorCommandHandler;
  let deleteCustomForecastIndicatorPort: DeleteCustomForecastIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        DeleteCustomForecastIndicatorCommandHandler,
        {
          provide: 'DeleteCustomForecastIndicatorPort',
          useValue: {
            deleteCustomForecastIndicator: jest.fn(),
          },
        },
      ],
    }).compile();
    deleteCustomForecastIndicatorCommandHandler = module.get(DeleteCustomForecastIndicatorCommandHandler);
    deleteCustomForecastIndicatorPort = module.get('DeleteCustomForecastIndicatorPort');
  }, 10000);

  it('예측지표를 삭제한다', async () => {
    // given
    const customForecastIndicatorId = '294612ba-9c7f-46a9-bc0c-272a5ec2b799';
    const command: DeleteCustomForecastIndicatorCommand = new DeleteCustomForecastIndicatorCommand(
      customForecastIndicatorId,
    );

    // when
    await deleteCustomForecastIndicatorCommandHandler.execute(command);

    // then
    expect(deleteCustomForecastIndicatorPort.deleteCustomForecastIndicator).toHaveBeenCalledTimes(1);
  });
});

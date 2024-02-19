import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../../application/port/persistence/load-indiactor-board-metadata.port';
import { DeleteIndicatorTickerCommandHandler } from '../../../application/command/delete-indicator-ticker/delete-indicator-ticker.command.handler';
import { DeleteIndicatorTickerPort } from '../../../application/port/persistence/delete-indicator-ticker.port';
import { DeleteIndicatorTickerCommand } from '../../../application/command/delete-indicator-ticker/delete-indicator-ticker.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('DeleteIndicatorTickerCommandHandler', () => {
  let deleteIndicatorTickerCommandHandler: DeleteIndicatorTickerCommandHandler;
  let deleteIndicatorTickerPort: DeleteIndicatorTickerPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        DeleteIndicatorTickerCommandHandler,
        {
          provide: 'DeleteIndicatorTickerPort',
          useValue: {
            deleteIndicatorTicker: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetaData: jest.fn().mockImplementation(() => {
              return new IndicatorBoardMetadata('id', 'name', { 'k-stock': ['ticker'], exchange: [] });
            }),
          },
        },
      ],
    }).compile();

    deleteIndicatorTickerCommandHandler = module.get(DeleteIndicatorTickerCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    deleteIndicatorTickerPort = module.get('DeleteIndicatorTickerPort');
  }, 10000);

  it('지표보드 메타데이터에서 지표 ticker를 삭제한다.', async () => {
    //given
    const indicatorBoardMetadata = await loadIndicatorBoardMetadataPort.loadIndicatorBoardMetaData('id');
    const command: DeleteIndicatorTickerCommand = new DeleteIndicatorTickerCommand(indicatorBoardMetadata.id, 'ticker');

    //when
    await deleteIndicatorTickerCommandHandler.execute(command);

    //then
    expect(deleteIndicatorTickerPort.deleteIndicatorTicker).toHaveBeenCalledTimes(1);
  });
});

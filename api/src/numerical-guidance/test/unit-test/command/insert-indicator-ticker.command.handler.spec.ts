import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { InsertIndicatorTickerPort } from '../../../application/port/persistence/insert-indicator-ticker.port';
import { LoadIndicatorBoardMetadataPort } from '../../../application/port/persistence/load-indiactor-board-metadata.port';
import { InsertIndicatorTickerCommandHandler } from '../../../application/command/insert-indicator-ticker/insert-indicator-ticker.command.handler';
import { InsertIndicatorTickerCommand } from '../../../application/command/insert-indicator-ticker/insert-indicator-ticker.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('InsertIndicatorTickerCommandHandler', () => {
  let insertIndicatorTickerCommandHandler: InsertIndicatorTickerCommandHandler;
  let insertIndicatorTickerPort: InsertIndicatorTickerPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        InsertIndicatorTickerCommandHandler,
        {
          provide: 'InsertIndicatorTickerPort',
          useValue: {
            addIndicatorTicker: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetaData: jest.fn().mockImplementation(() => {
              return new IndicatorBoardMetadata('id', 'name', { 'k-stock': [], exchange: [] });
            }),
          },
        },
      ],
    }).compile();

    insertIndicatorTickerCommandHandler = module.get(InsertIndicatorTickerCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    insertIndicatorTickerPort = module.get('InsertIndicatorTickerPort');
  }, 10000);

  it('지표보드 메타데이터에 지표 ticker를 추가한다.', async () => {
    //given
    const command: InsertIndicatorTickerCommand = new InsertIndicatorTickerCommand('id', 'ticker', 'k-stock');

    //when
    await insertIndicatorTickerCommandHandler.execute(command);

    //then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetaData).toHaveBeenCalledTimes(1);
    expect(insertIndicatorTickerPort.addIndicatorTicker).toHaveBeenCalledTimes(1);
  });
});

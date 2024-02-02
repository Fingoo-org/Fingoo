import { CreateIndicatorBoardMetaDataCommandHandler } from '../../../application/command/create-indicator-board-meta-data/create-indicator-board-meta-data.command.handler';
import { CreateIndicatorBoardMetaDataPort } from '../../../application/port/persistent/create-indicator-board-meta-data.port';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CreateIndicatorBoardMetaDataCommand } from '../../../application/command/create-indicator-board-meta-data/create-indicator-board-meta-data.command';
import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';

describe('CreateIndicatorBoardMetaDataCommandHandler', () => {
  let createIndicatorBoardMetaDataCommandHandler: CreateIndicatorBoardMetaDataCommandHandler;
  let createIndicatorBoardMetaDataPort: CreateIndicatorBoardMetaDataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        CreateIndicatorBoardMetaDataCommandHandler,
        {
          provide: 'CreateIndicatorBoardMetaDataPort',
          useValue: {
            createIndicatorBoardMetaData: jest.fn(),
          },
        },
      ],
    }).compile();

    createIndicatorBoardMetaDataCommandHandler = module.get(CreateIndicatorBoardMetaDataCommandHandler);
    createIndicatorBoardMetaDataPort = module.get('CreateIndicatorBoardMetaDataPort');
  }, 10000);

  it('지표보드 메타데이터를 생성한다.', async () => {
    //given
    const command: CreateIndicatorBoardMetaDataCommand = new CreateIndicatorBoardMetaDataCommand(
      '메타데이터',
      { key1: ['1', '2', '3'] },
      1,
    );

    //when
    const indicatorBoardMetaData: IndicatorBoardMetaData =
      await createIndicatorBoardMetaDataCommandHandler.execute(command);

    //then
    expect(indicatorBoardMetaData.indicatorBoardMetaDataName).toEqual('메타데이터');
    expect(createIndicatorBoardMetaDataPort.createIndicatorBoardMetaData).toHaveBeenCalledTimes(1);
  });
});

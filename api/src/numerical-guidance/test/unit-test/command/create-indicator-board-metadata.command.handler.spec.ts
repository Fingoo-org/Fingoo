import { CreateIndicatorBoardMetadataCommandHandler } from '../../../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { CreateIndicatorBoardMetadataPort } from '../../../application/port/persistence/create-indicator-board-metadata.port';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CreateIndicatorBoardMetadataCommand } from '../../../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CreateIndicatorBoardMetaDataCommandHandler', () => {
  let createIndicatorBoardMetaDataCommandHandler: CreateIndicatorBoardMetadataCommandHandler;
  let createIndicatorBoardMetaDataPort: CreateIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        CreateIndicatorBoardMetadataCommandHandler,
        {
          provide: 'CreateIndicatorBoardMetaDataPort',
          useValue: {
            createIndicatorBoardMetaData: jest.fn(),
          },
        },
      ],
    }).compile();

    createIndicatorBoardMetaDataCommandHandler = module.get(CreateIndicatorBoardMetadataCommandHandler);
    createIndicatorBoardMetaDataPort = module.get('CreateIndicatorBoardMetaDataPort');
  }, 10000);

  it('지표보드 메타데이터를 생성한다.', async () => {
    //given
    const command: CreateIndicatorBoardMetadataCommand = new CreateIndicatorBoardMetadataCommand('메타데이터', 1);

    //when
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await createIndicatorBoardMetaDataCommandHandler.execute(command);

    //then
    expect(indicatorBoardMetaData.indicatorBoardMetaDataName).toEqual('메타데이터');
    expect(createIndicatorBoardMetaDataPort.createIndicatorBoardMetaData).toHaveBeenCalledTimes(1);
  });
});

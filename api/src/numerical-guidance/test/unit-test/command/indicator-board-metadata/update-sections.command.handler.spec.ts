import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../../../application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { UpdateSectionsCommandHandler } from '../../../../application/command/indicator-board-metadata/update-sections/update-sections.command.handler';
import { UpdateSectionsPort } from '../../../../application/port/persistence/indicator-board-metadata/update-sections.port';
import { UpdateSectionsCommand } from '../../../../application/command/indicator-board-metadata/update-sections/update-sections.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateSectionsCommandHandler', () => {
  let updateSectionsCommandHandler: UpdateSectionsCommandHandler;
  let updateSectionsPort: UpdateSectionsPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UpdateSectionsCommandHandler,
        {
          provide: 'UpdateSectionsPort',
          useValue: {
            updateSections: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetadata: jest.fn().mockImplementation(() => {
              const currentDate: Date = new Date();
              return new IndicatorBoardMetadata('id', 'name', [], [], { section1: [] }, currentDate, currentDate);
            }),
          },
        },
      ],
    }).compile();

    updateSectionsCommandHandler = module.get(UpdateSectionsCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    updateSectionsPort = module.get('UpdateSectionsPort');
  }, 10000);

  it('지표보드 Sections를 수정한다..', async () => {
    //given
    const command: UpdateSectionsCommand = new UpdateSectionsCommand('id', { section1: [], section2: [] });

    //when
    await updateSectionsCommandHandler.execute(command);

    //then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
    expect(updateSectionsPort.updateSections).toHaveBeenCalledTimes(1);
  });
});

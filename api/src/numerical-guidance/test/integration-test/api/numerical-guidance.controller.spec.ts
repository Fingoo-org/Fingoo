import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../../api/numerical-guidance.controller';
import { GetFluctuatingIndicatorQueryHandler } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { CreateIndicatorBoardMetadataCommandHandler } from '../../../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { InsertIndicatorIdCommandHandler } from '../../../application/command/insert-indicator-id/insert-indicator-id.command.handler';

const testData = fluctuatingIndicatorTestData;

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('NumericalGuidanceController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [CqrsModule],
        controllers: [NumericalGuidanceController],
        providers: [
          GetFluctuatingIndicatorQueryHandler,
          CreateIndicatorBoardMetadataCommandHandler,
          InsertIndicatorIdCommandHandler,
          {
            provide: 'LoadCachedFluctuatingIndicatorPort',
            useValue: {
              loadCachedFluctuatingIndicator: jest.fn().mockImplementation(() => {
                return FluctuatingIndicatorDto.create(testData);
              }),
            },
          },
          {
            provide: 'LoadFluctuatingIndicatorPort',
            useValue: {
              loadFluctuatingIndicator: jest.fn().mockImplementation(() => {
                return FluctuatingIndicatorDto.create(testData);
              }),
            },
          },
          {
            provide: 'CachingFluctuatingIndicatorPort',
            useValue: {
              cachingFluctuatingIndicator: jest.fn(),
            },
          },
          {
            provide: 'CreateIndicatorBoardMetaDataPort',
            useValue: {
              createIndicatorBoardMetaData: jest.fn(),
            },
          },
          {
            provide: 'LoadIndicatorBoardMetadataPort',
            useValue: {
              loadIndicatorBoardMetaData: jest.fn(),
            },
          },
          {
            provide: 'InsertIndicatorIdPort',
            useValue: {
              addIndicatorId: jest.fn(),
            },
          },
        ],
      }).compile(),
    ]);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('/get 변동 지표를 불러온다.', () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicators/k-stock')
      .query({
        dataCount: 2,
        ticker: '005930',
        interval: 'day',
        market: 'KOSPI',
        endDate: '20240125',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicators/k-stock')
      .query({
        dataCount: 2,
        ticker: '005930',
        market: 2,
        endDate: '20240125',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/post 지표보드 메타데이터를 생성한다.', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata')
      .send({
        indicatorBoardMetadataName: '메타데이터',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터를 생성할 때 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata')
      .send({
        indicatorBoardMetadataName: ' ',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});

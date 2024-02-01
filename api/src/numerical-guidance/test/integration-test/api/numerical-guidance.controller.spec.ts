import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../../infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorQueryHandler } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { CreateIndicatorBoardMetaDataCommandHandler } from '../../../application/command/create-indicator-board-meta-data/create-indicator-board-meta-data.command.handler';

const testData = fluctuatingIndicatorTestData;

describe('NumericalGuidanceController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [CqrsModule],
        controllers: [NumericalGuidanceController],
        providers: [
          GetFluctuatingIndicatorQueryHandler,
          CreateIndicatorBoardMetaDataCommandHandler,
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
      .get('/numerical-guidance/fluctuatingIndicator')
      .query({
        dataCount: 2,
        ticker: '005930',
        market: 'market',
        interval: 'day',
        endDate: '20240125',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/numerical-guidance/fluctuatingIndicator')
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
      .post('/numerical-guidance/indicatorBoardMetaData')
      .send({
        indicatorBoardMetaDataName: '메타데이터',
        indicatorIds: { key1: ['1', '2', '3'] },
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('지표보드 메타데이터를 생성할 때 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .post('/numerical-guidance/indicatorBoardMetaData')
      .send({
        indicatorBoardMetaDataName: '메타데이터',
        indicatorIds: {},
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { FluctuatingIndicatorsWithoutCacheDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/flucruatingIndicator-without-cache.dto';

@Injectable()
export class FluctuatingIndicatorKrxAdapter {
  private readonly logger = new Logger(FluctuatingIndicatorKrxAdapter.name);
  constructor(private readonly api: HttpService) {}

  async loadFluctuatingIndicatorWithoutCache(
    dataCount: number,
    ticker: string,
    market: string,
    type: string,
  ): Promise<FluctuatingIndicatorsWithoutCacheDto> {
    // KRX API 통신
    const request_url: string = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=f5burUfSauyza43%2F8ohdEUPRiVyXVJaN31DAiPF4bGgtif%2BdgQVtK11RWjpybFBCdhIPi%2FVrjDvSYTpwBrakRA%3D%3D&numOfRows=${dataCount}&pageNo=1&resultType=json&beginBasDt=20230101&endBasDt=20230105&likeSrtnCd=${ticker}&mrktCls=${market.toUpperCase()}`;
    /*
        (중요)
        테스트 코드의 목 데이터와 실제 API연동 데이터가 달라서 테스트 할 때마다 fail이 발생함
        일단, api요청 url에는 시작 날짜와 마지막 날자를 설정해서 테스트할 때마다 동일한 데이터를 받아올 수 있게 설정
        추후 비즈니스 요구사항이 생길 시, 시작 날짜와 마지막 날짜를 파라미터에 추가해도 됨
        */
    console.log(type);
    const res = await lastValueFrom(
      this.api.get(request_url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const responseData: FluctuatingIndicatorsWithoutCacheDto = res.data;

    return responseData;
  }
}

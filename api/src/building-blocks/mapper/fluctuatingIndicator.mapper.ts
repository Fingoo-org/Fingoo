import {
  FluctuatingIndicatorsDto,
  Response,
} from '../../numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export class FluctuatingIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      response: Response;
    } = JSON.parse(stringData);

    const header = {
      resultCode: data.response.header.resultCode,
      resultMsg: data.response.header.resultMsg,
    };

    const body = {
      numOfRows: data.response.body.numOfRows,
      pageNo: data.response.body.pageNo,
      totalCount: data.response.body.totalCount,
      items: data.response.body.items,
    };

    const response = {
      header: header,
      body: body,
    };

    return FluctuatingIndicatorsDto.create({ response: response });
  }
}

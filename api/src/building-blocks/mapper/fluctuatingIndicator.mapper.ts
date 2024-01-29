import {
  FluctuatingIndicatorDto,
  Items,
} from '../../numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class FluctuatingIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      numOfRows: number;
      pageNo: number;
      totalCount: number;
      items: Items;
    } = JSON.parse(stringData);

    return FluctuatingIndicatorDto.create({
      numOfRows: data.numOfRows,
      pageNo: data.pageNo,
      totalCount: data.totalCount,
      items: data.items,
    });
  }
}

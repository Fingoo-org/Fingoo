import {
  FluctuatingIndicatorDto,
  Items,
} from '../../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class FluctuatingIndicatorMapper {
  static mapToDto(stringData: string) {
    const data: {
      type: string;
      numOfRows: number;
      pageNo: number;
      totalCount: number;
      items: Items;
    } = JSON.parse(stringData);

    return FluctuatingIndicatorDto.create({
      type: data.type,
      numOfRows: data.numOfRows,
      pageNo: data.pageNo,
      totalCount: data.totalCount,
      items: data.items,
    });
  }
}

import { Market } from 'src/utils/type/types';

export type Item = {
  basDt: string;
  srtnCd: string;
  isinCd: string;
  itmsNm: string;
  mrktCtg: Market;
  clpr: string;
  vs: string;
  fltRt: string;
  mkp: string;
  hipr: string;
  lopr: string;
  trqu: string;
  trPrc: string;
  lstgStCnt: string;
  mrktTotAmt: string;
};

export type Items = {
  item: Item[];
};

export type IndicatorType = 'k-stock' | 'exchange';

export class FluctuatingIndicatorDto {
  type: IndicatorType;
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  items: Items;

  private constructor(type: IndicatorType, numOfRows: number, pageNo: number, totalCount: number, items: Items) {
    this.type = type;
    this.numOfRows = numOfRows;
    this.pageNo = pageNo;
    this.totalCount = totalCount;
    this.items = items;
  }

  static create({ type, numOfRows, pageNo, totalCount, items }): FluctuatingIndicatorDto {
    return new FluctuatingIndicatorDto(type, numOfRows, pageNo, totalCount, items);
  }
}

export type Item = {
  basDt: string;
  srtnCd: string;
  isinCd: string;
  itmsNm: string;
  mrktCtg: string;
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

export class FluctuatingIndicatorsDto {
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  items: Items;

  private constructor(numOfRows: number, pageNo: number, totalCount: number, items: Items) {
    this.numOfRows = numOfRows;
    this.pageNo = pageNo;
    this.totalCount = totalCount;
    this.items = items;
  }

  static create({ numOfRows, pageNo, totalCount, items }): FluctuatingIndicatorsDto {
    return new FluctuatingIndicatorsDto(numOfRows, pageNo, totalCount, items);
  }
}

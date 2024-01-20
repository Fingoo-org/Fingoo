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

export type Body = {
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  items: Items;
};

export type Header = {
  resultCode: string;
  resultMsg: string;
};

export type Response = {
  header: Header;
  body: Body;
};

export class FluctuatingIndicatorsDto {
  response: Response;

  private constructor(response: Response) {
    this.response = response;
  }

  static create({ response }: { response: any }): FluctuatingIndicatorsDto {
    return new FluctuatingIndicatorsDto(response);
  }
}

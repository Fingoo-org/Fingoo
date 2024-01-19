type StockItem = {
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

type Item = {
  item: StockItem[];
};

type Body = {
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  items: Item[];
};

export class FluctuatingIndicatorsDto {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: Body;

  private constructor(header: { resultCode: string; resultMsg: string }, body: Body) {
    this.header = header;
    this.body = body;
  }

  static create(StringData: string): FluctuatingIndicatorsDto {
    const data: {
      resultCode: string;
      resultMsg: string;
      numOfRows: number;
      pageNo: number;
      totalCount: number;
      items: Item[];
    } = JSON.parse(StringData);

    const header = {
      resultCode: data.resultCode,
      resultMsg: data.resultMsg,
    };

    const body = {
      numOfRows: data.numOfRows,
      pageNo: data.pageNo,
      totalCount: data.totalCount,
      items: data.items.map((item) => ({
        item: item.item.map((subItem) => ({
          basDt: subItem.basDt,
          srtnCd: subItem.srtnCd,
          isinCd: subItem.isinCd,
          itmsNm: subItem.itmsNm,
          mrktCtg: subItem.mrktCtg,
          clpr: subItem.clpr,
          vs: subItem.vs,
          fltRt: subItem.fltRt,
          mkp: subItem.mkp,
          hipr: subItem.hipr,
          lopr: subItem.lopr,
          trqu: subItem.trqu,
          trPrc: subItem.trPrc,
          lstgStCnt: subItem.lstgStCnt,
          mrktTotAmt: subItem.mrktTotAmt,
        })),
      })),
    };
    return new FluctuatingIndicatorsDto(header, body);
  }
}

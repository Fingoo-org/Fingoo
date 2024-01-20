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
      items: data.response.body.items.item.map((subItem) => ({
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
    };

    const response = {
      header: header,
      body: body,
    };

    return FluctuatingIndicatorsDto.create({ response: response });
  }
}

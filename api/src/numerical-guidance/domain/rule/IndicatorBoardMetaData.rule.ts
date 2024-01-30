import { BusinessRule } from '../../../building-blocks/domain/business.rule';

const INDICATOR_MINIMUM = 1;

export class IndicatorBoardMetaDataRule implements BusinessRule {
  constructor(readonly indicatorIds: Record<string, string[]>) {}

  // TODO: 사용자의 권한에 따라 제한
  // isBroken = () => this.indicatorIds < INDICATOR_MINIMUM;
  isBroken = () => false;

  get Message() {
    return `지표는 최소 ${INDICATOR_MINIMUM}개 이상 선택해야합니다.`;
  }
}

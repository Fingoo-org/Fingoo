import { BusinessRule } from '../../../building-blocks/domain/business.rule';

const INDICATOR_KEY_MINIMUM = 1;
const INDICATOR_MINIMUM = 1;

export class IndicatorBoardMetaDataMustNotBeEmptyRule implements BusinessRule {
  constructor(private readonly indicatorIds: Record<string, string[]>) {}

  isBroken = () =>
    Object.keys(this.indicatorIds).length !== INDICATOR_KEY_MINIMUM ||
    this.indicatorIds[Object.keys(this.indicatorIds)[0]].length < INDICATOR_MINIMUM;

  get Message() {
    return `지표의 key 배열은 ${INDICATOR_KEY_MINIMUM}개이며, 지표 개수는 최소 ${INDICATOR_MINIMUM}개 이상 선택해야합니다.`;
  }
}

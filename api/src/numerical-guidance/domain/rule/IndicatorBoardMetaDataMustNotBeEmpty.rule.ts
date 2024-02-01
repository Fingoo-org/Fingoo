import { BusinessRule } from '../../../building-blocks/domain/business.rule';

const INDICATOR_KEY_MINIMUM = 1;

export class IndicatorBoardMetaDataMustNotBeEmptyRule implements BusinessRule {
  constructor(private readonly indicatorIds: Record<string, string[]>) {}

  isBroken = () => Object.keys(this.indicatorIds).length !== INDICATOR_KEY_MINIMUM;

  get Message() {
    return `지표의 key 배열은 최소 ${INDICATOR_KEY_MINIMUM}개입니다..`;
  }
}

import { BusinessRule } from '../../../utils/building-blocks/domain/business.rule';

export class IndicatorBoardMetaDataNameShouldNotEmptyRule implements BusinessRule {
  constructor(private readonly indicatorBoardMetaDataName: string) {}

  isBroken = () =>
    this.indicatorBoardMetaDataName == '' ||
    this.indicatorBoardMetaDataName.trim() == '' ||
    this.indicatorBoardMetaDataName.length === 0 ||
    !this.indicatorBoardMetaDataName;

  get Message() {
    return `지표보드 메타데이터의 이름은 비워둘 수 없습니다.`;
  }
}

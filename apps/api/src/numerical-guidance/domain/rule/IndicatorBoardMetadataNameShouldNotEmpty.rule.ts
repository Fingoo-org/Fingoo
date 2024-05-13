import { BusinessRule } from '../../../utils/domain/business.rule';

export class IndicatorBoardMetadataNameShouldNotEmptyRule implements BusinessRule {
  constructor(private readonly indicatorBoardMetadataName: string) {}

  isBroken = () =>
    this.indicatorBoardMetadataName === '' ||
    this.indicatorBoardMetadataName.trim() === '' ||
    this.indicatorBoardMetadataName.length === 0 ||
    !this.indicatorBoardMetadataName;

  get Message() {
    return `지표보드 메타데이터의 이름은 비워둘 수 없습니다.`;
  }
}

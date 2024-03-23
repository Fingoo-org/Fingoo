import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class IndicatorBoardMetadata {
  // 여기는 response와 같아야함
  // 변경된 부분은 private으로 client에서 못사용하게
  // 변경된 부분은 getter, setter로 변경에서 전처럼 사용하도록
  readonly id: string;
  readonly indicatorBoardMetadataName: string;
  // private name: string;
  public customForecastIndicatorIds: string[];
  public indicatorIds: string[];

  constructor({
    id,
    indicatorBoardMetadataName,
    indicatorIds,
    customForecastIndicatorIds,
  }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;

    // temp: api 문제로 임시 처리
    this.indicatorIds = indicatorIds.filter((id) => id !== '');
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  get name() {
    return this.indicatorBoardMetadataName;
  }

  get formattedIndicatorBoardMetadata(): IndicatorBoardMetadataResponse {
    return {
      id: this.id,
      indicatorBoardMetadataName: this.name,
      indicatorIds: this.indicatorIds,
      customForecastIndicatorIds: this.customForecastIndicatorIds,
    };
  }

  addIndicator(indicatorId: string) {
    this.indicatorIds = [...this.indicatorIds, indicatorId];
  }

  addCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = [...this.customForecastIndicatorIds, customForecastIndicatorId];
  }

  deleteCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = this.customForecastIndicatorIds.filter((id) => id !== customForecastIndicatorId);
  }

  deleteIndicator(indicatorId: string) {
    this.indicatorIds = this.indicatorIds.filter((id) => id !== indicatorId);
  }
}

export class IndicatorBoardMetadataList extends Array<IndicatorBoardMetadata> {
  constructor(metadataList: IndicatorBoardMetadataResponse[]) {
    super();
    metadataList.forEach((metadata) => {
      this.push(new IndicatorBoardMetadata(metadata));
    });
  }

  static get [Symbol.species]() {
    return Array;
  }

  findIndicatorBoardMetadataById(metadataId: string) {
    return this.find((metadata) => metadata.id === metadataId);
  }

  deleteIndicatorBoardMetadata(metadataId: string) {
    const index = this.findIndex((metadata) => metadata.id === metadataId);
    if (index === -1) return;

    this.splice(index, 1);
  }

  addIndicatorToMetadataById(metadataId: string | undefined, indicatorId: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.addIndicator(indicatorId);
  }

  addCustomForecastIndicatorToMetadataById(metadataId: string | undefined, customForecastIndicatorId: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.addCustomForecastIndicator(customForecastIndicatorId);
  }

  deleteCustomForecastIndicatorFromMetadataById(metadataId: string | undefined, customForecastIndicatorId: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.deleteCustomForecastIndicator(customForecastIndicatorId);
  }

  updateIndicatorBoardMetadataNameById(metadataId: string | undefined, indicatorBoardMetadataName: string) {
    const index = this.findIndex((metadata) => metadata.id === metadataId);
    if (index === -1) return;

    const metadata = this[index];

    this[index] = new IndicatorBoardMetadata({
      ...metadata.formattedIndicatorBoardMetadata,
      indicatorBoardMetadataName,
    });
  }

  deleteIndicatorFromMetadataById(metadataId: string | undefined, indicatorId: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.deleteIndicator(indicatorId);
  }

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataResponse[]) => {
  return new IndicatorBoardMetadataList(response);
};

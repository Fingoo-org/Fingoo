import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class IndicatorBoardMetadata {
  // 여기는 response와 같아야함
  // 변경된 부분은 private으로 client에서 못사용하게
  // 변경된 부분은 getter, setter로 변경에서 전처럼 사용하도록
  readonly id: string;
  readonly name: string;
  readonly customForecastIndicatorIds: string[];
  public indicatorIds: string[];

  constructor({ id, name, indicatorIds, customForecastIndicatorIds }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.name = name;
    this.indicatorIds = indicatorIds;
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  get formattedIndicatorBoardMetadata() {
    return {
      id: this.id,
      name: this.name,
      indicatorIds: this.indicatorIds,
      customForecastIndicatorIds: this.customForecastIndicatorIds,
    };
  }

  addIndicator(indicatorId: string) {
    this.indicatorIds = [...this.indicatorIds, indicatorId];
  }

  deleteIndicator(indicatorKey: string) {
    this.indicatorIds = this.indicatorIds.filter((indicatorId) => indicatorId !== indicatorKey);
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

  updateIndicatorBoardMetadataNameById(metadataId: string | undefined, name: string) {
    const index = this.findIndex((metadata) => metadata.id === metadataId);
    if (index === -1) return;

    const metadata = this[index];

    this[index] = new IndicatorBoardMetadata({ ...metadata.formattedIndicatorBoardMetadata, name });
  }

  deleteIndicatorFromMetadataById(metadataId: string | undefined, indicatorKey: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.deleteIndicator(indicatorKey);
  }

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataResponse[]) => {
  return new IndicatorBoardMetadataList(response);
};

import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class IndicatorBoardMetadata {
  // 여기는 response와 같아야함
  // 변경된 부분은 private으로 client에서 못사용하게
  // 변경된 부분은 getter, setter로 변경에서 전처럼 사용하도록
  readonly id: string;
  readonly indicatorBoardMetadataName: string;
  public indicatorIdsWithSessionIds: { [key: string]: string[] };
  // private name: string;
  public customForecastIndicatorIds: string[];
  public indicatorIds: string[];

  constructor({
    id,
    indicatorBoardMetadataName,
    indicatorIds,
    customForecastIndicatorIds,
    indicatorIdsWithSessionIds,
  }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.indicatorIdsWithSessionIds = indicatorIdsWithSessionIds;
    // temp: api 문제로 임시 처리
    this.indicatorIds = indicatorIds.filter((id) => id !== '');
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  get name() {
    return this.indicatorBoardMetadataName;
  }

  get lastSessionId() {
    return `session${Object.keys(this.indicatorIdsWithSessionIds).length}`;
  }

  get formattedIndicatorBoardMetadata(): IndicatorBoardMetadataResponse {
    return {
      id: this.id,
      indicatorBoardMetadataName: this.name,
      indicatorIds: this.indicatorIds,
      customForecastIndicatorIds: this.customForecastIndicatorIds,
      indicatorIdsWithSessionIds: this.indicatorIdsWithSessionIds,
    };
  }

  addIndicator(indicatorId: string) {
    this.indicatorIds = [...this.indicatorIds, indicatorId];
    this.indicatorIdsWithSessionIds = {
      ...this.indicatorIdsWithSessionIds,
      [this.lastSessionId]: [...this.indicatorIdsWithSessionIds[this.lastSessionId], indicatorId],
    };
  }

  addCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = [...this.customForecastIndicatorIds, customForecastIndicatorId];

    this.indicatorIdsWithSessionIds = {
      ...this.indicatorIdsWithSessionIds,
      [this.lastSessionId]: [...this.indicatorIdsWithSessionIds[this.lastSessionId], customForecastIndicatorId],
    };
  }

  deleteCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = this.customForecastIndicatorIds.filter((id) => id !== customForecastIndicatorId);
    this.indicatorIdsWithSessionIds = Object.entries(this.indicatorIdsWithSessionIds).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== customForecastIndicatorId);
      return acc;
    }, {});
  }

  deleteIndicator(indicatorId: string) {
    this.indicatorIds = this.indicatorIds.filter((id) => id !== indicatorId);
    this.indicatorIdsWithSessionIds = Object.entries(this.indicatorIdsWithSessionIds).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== indicatorId);
      return acc;
    }, {});
  }

  updateIndicatorIdsWithSessionIds(indicatorIdsWithSessionIds: { [key: string]: string[] }) {
    this.indicatorIdsWithSessionIds = indicatorIdsWithSessionIds;
  }

  addSession() {
    const element = this.indicatorIdsWithSessionIds['session1'].shift();

    const newData = Object.keys(this.indicatorIdsWithSessionIds).reduce<{
      [key: string]: string[];
    }>((acc, _, index) => {
      acc[`session${index + 2}`] = this.indicatorIdsWithSessionIds[`session${index + 1}`];
      return acc;
    }, {});

    newData['session1'] = element ? [element] : [];

    this.indicatorIdsWithSessionIds = newData;
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

  updateIndicatorIdsWithSessionIds(
    metadataId: string | undefined,
    indicatorIdsWithSessionIds: { [key: string]: string[] },
  ) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.updateIndicatorIdsWithSessionIds(indicatorIdsWithSessionIds);
  }

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataResponse[]) => {
  return new IndicatorBoardMetadataList(response);
};

export const convertIndicatorBoardMetadata = (response: IndicatorBoardMetadataResponse) => {
  return new IndicatorBoardMetadata(response);
};

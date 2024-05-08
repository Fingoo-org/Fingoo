import {
  IndicatorBoardMetadataResponse,
  IndicatorInfoResponse,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class IndicatorBoardMetadata {
  // 여기는 response와 같아야함
  // 변경된 부분은 private으로 client에서 못사용하게
  // 변경된 부분은 getter, setter로 변경에서 전처럼 사용하도록
  readonly id: string;
  readonly indicatorBoardMetadataName: string;
  // private name: string;
  public customForecastIndicatorIds: string[];
  public indicatorInfos: IndicatorInfoResponse[];
  private sections: { [key: string]: string[] };
  constructor({
    id,
    indicatorBoardMetadataName,
    indicatorInfos,
    customForecastIndicatorIds,
    sections,
  }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.sections = sections;
    this.indicatorInfos = indicatorInfos;
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  get name() {
    return this.indicatorBoardMetadataName;
  }

  get indicatorIdsWithSectionIds() {
    return this.sections;
  }

  get lastsectionId() {
    return `section${Object.keys(this.sections).length}`;
  }

  get indicatorIds() {
    return this.indicatorInfos.map((info) => info.id);
  }

  get formattedIndicatorBoardMetadata(): IndicatorBoardMetadataResponse {
    return {
      id: this.id,
      indicatorBoardMetadataName: this.name,
      indicatorInfos: this.indicatorInfos,
      customForecastIndicatorIds: this.customForecastIndicatorIds,
      sections: this.sections,
    };
  }

  get isEmpty() {
    return this.indicatorInfos.length === 0 && this.customForecastIndicatorIds.length === 0;
  }

  getIndicatorInfo(indicatorId: string) {
    return this.indicatorInfos.find((indicatorInfo) => indicatorInfo.id === indicatorId);
  }

  addIndicator(newIndicatorInfo: IndicatorInfoResponse) {
    this.indicatorInfos = [...this.indicatorInfos, newIndicatorInfo];
    this.sections = {
      ...this.sections,
      [this.lastsectionId]: [...this.sections[this.lastsectionId], newIndicatorInfo.id],
    };
  }

  addCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = [...this.customForecastIndicatorIds, customForecastIndicatorId];

    this.sections = {
      ...this.sections,
      [this.lastsectionId]: [...this.sections[this.lastsectionId], customForecastIndicatorId],
    };
  }

  deleteCustomForecastIndicator(customForecastIndicatorId: string) {
    this.customForecastIndicatorIds = this.customForecastIndicatorIds.filter((id) => id !== customForecastIndicatorId);
    this.sections = Object.entries(this.sections).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== customForecastIndicatorId);
      return acc;
    }, {});
  }

  deleteIndicator(indicatorId: string) {
    this.indicatorInfos = this.indicatorInfos.filter((indicatorInfo) => indicatorInfo.id !== indicatorId);
    this.sections = Object.entries(this.sections).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== indicatorId);
      return acc;
    }, {});
  }

  updateIndicatorIdsWithsectionIds(sections: { [key: string]: string[] }) {
    this.sections = sections;
  }

  addsection() {
    const element = this.sections['section1'].shift();

    const newData = Object.keys(this.sections).reduce<{
      [key: string]: string[];
    }>((acc, _, index) => {
      acc[`section${index + 2}`] = this.sections[`section${index + 1}`];
      return acc;
    }, {});

    newData['section1'] = element ? [element] : [];

    this.sections = newData;
  }

  deletesection(sectionId: number) {
    const newData = Object.keys(this.sections).reduce<{
      [key: string]: string[];
    }>((acc, key, index) => {
      if (index === sectionId) {
        acc[`section${index}`] = [...acc[`section${index}`], ...this.sections[`section${index + 1}`]];
      } else if (index < sectionId) {
        acc[`section${index + 1}`] = this.sections[`section${index + 1}`];
      } else {
        acc[`section${index}`] = this.sections[`section${index + 1}`];
      }

      return acc;
    }, {});

    this.sections = newData;
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

  addIndicatorToMetadataById(metadataId: string | undefined, indicatorInfo: IndicatorInfoResponse) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.addIndicator(indicatorInfo);
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

  updateIndicatorIdsWithsectionIds(metadataId: string | undefined, sections: { [key: string]: string[] }) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.updateIndicatorIdsWithsectionIds(sections);
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

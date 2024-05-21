import {
  IndicatorBoardMetadataResponse,
  IndicatorInfoResponse,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class IndicatorBoardMetadata {
  readonly id: string;
  readonly indicatorBoardMetadataName: string;
  public customForecastIndicatorIds: string[];
  public indicatorInfos: IndicatorInfoResponse[];
  private _sections: { [key: string]: string[] };
  constructor({
    id,
    indicatorBoardMetadataName,
    indicatorInfos,
    customForecastIndicatorIds,
    sections,
  }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this._sections = sections;
    this.indicatorInfos = indicatorInfos;
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  static createNew({ ...args }: IndicatorBoardMetadataResponse) {
    return new IndicatorBoardMetadata(args);
  }

  get sections() {
    return this._sections;
  }

  get name() {
    return this.indicatorBoardMetadataName;
  }

  get indicatorIdsWithSectionIds() {
    return this._sections;
  }

  get lastsectionId() {
    return `section${Object.keys(this._sections).length}`;
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
      sections: this._sections,
    };
  }

  get isEmpty() {
    return this.indicatorInfos.length === 0 && this.customForecastIndicatorIds.length === 0;
  }

  getIndicatorInfo(indicatorId: string) {
    return this.indicatorInfos.find((indicatorInfo) => indicatorInfo.id === indicatorId);
  }

  addIndicator(newIndicatorInfo: IndicatorInfoResponse) {
    return IndicatorBoardMetadata.createNew({
      ...this.formattedIndicatorBoardMetadata,
      indicatorInfos: [...this.indicatorInfos, newIndicatorInfo],
      sections: {
        ...this._sections,
        [this.lastsectionId]: [...this._sections[this.lastsectionId], newIndicatorInfo.id],
      },
    });
  }

  addCustomForecastIndicator(customForecastIndicatorId: string) {
    return IndicatorBoardMetadata.createNew({
      ...this.formattedIndicatorBoardMetadata,
      customForecastIndicatorIds: [...this.customForecastIndicatorIds, customForecastIndicatorId],
      sections: {
        ...this._sections,
        [this.lastsectionId]: [...this._sections[this.lastsectionId], customForecastIndicatorId],
      },
    });
  }

  deleteCustomForecastIndicator(customForecastIndicatorId: string) {
    return IndicatorBoardMetadata.createNew({
      ...this.formattedIndicatorBoardMetadata,
      sections: Object.entries(this._sections).reduce<{
        [key: string]: string[];
      }>((acc, [key, value]) => {
        acc[key] = value.filter((id) => id !== customForecastIndicatorId);
        return acc;
      }, {}),
      customForecastIndicatorIds: this.customForecastIndicatorIds.filter((id) => id !== customForecastIndicatorId),
    });
  }

  deleteIndicator(indicatorId: string) {
    this.indicatorInfos = this.indicatorInfos.filter((indicatorInfo) => indicatorInfo.id !== indicatorId);
    this._sections = Object.entries(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== indicatorId);
      return acc;
    }, {});
  }

  updateIndicatorIdsWithsectionIds(sections: { [key: string]: string[] }) {
    this._sections = sections;
  }

  addsection() {
    const element = this._sections['section1'].shift();

    const newData = Object.keys(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, _, index) => {
      acc[`section${index + 2}`] = this._sections[`section${index + 1}`];
      return acc;
    }, {});

    newData['section1'] = element ? [element] : [];

    this._sections = newData;
  }

  deletesection(sectionId: number) {
    const newData = Object.keys(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, key, index) => {
      if (index === sectionId) {
        acc[`section${index}`] = [...acc[`section${index}`], ...this._sections[`section${index + 1}`]];
      } else if (index < sectionId) {
        acc[`section${index + 1}`] = this._sections[`section${index + 1}`];
      } else {
        acc[`section${index}`] = this._sections[`section${index + 1}`];
      }

      return acc;
    }, {});

    this._sections = newData;
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

  static createNew(metadataList: IndicatorBoardMetadataResponse[]) {
    return new IndicatorBoardMetadataList(metadataList);
  }

  iterate(callback: (metadata: IndicatorBoardMetadata) => IndicatorBoardMetadata): IndicatorBoardMetadataList {
    return IndicatorBoardMetadataList.createNew(this.map(callback));
  }

  findIndicatorBoardMetadataById(metadataId: string) {
    return this.find((metadata) => metadata.id === metadataId);
  }

  deleteIndicatorBoardMetadata(metadataId: string) {
    return IndicatorBoardMetadataList.createNew(this.filter((metadata) => metadata.id !== metadataId));
  }

  addIndicatorToMetadataById(metadataId: string | undefined, indicatorInfo: IndicatorInfoResponse) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.addIndicator(indicatorInfo);
      }

      return metadata;
    });
  }

  addCustomForecastIndicatorToMetadataById(metadataId: string | undefined, customForecastIndicatorId: string) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.addCustomForecastIndicator(customForecastIndicatorId);
      }

      return metadata;
    });
  }

  deleteCustomForecastIndicatorFromMetadataById(metadataId: string | undefined, customForecastIndicatorId: string) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.deleteCustomForecastIndicator(customForecastIndicatorId);
      }

      return metadata;
    });
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

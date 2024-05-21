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

  private createStateDump({ ...rest }: Partial<IndicatorBoardMetadataResponse>) {
    return convertIndicatorBoardMetadata({
      ...this.formattedIndicatorBoardMetadata,
      ...rest,
    });
  }

  private deleteIndicatorFromSection(indicatorId: string) {
    return Object.entries(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, [key, value]) => {
      acc[key] = value.filter((id) => id !== indicatorId);
      return acc;
    }, {});
  }

  getIndicatorInfo(indicatorId: string) {
    return this.indicatorInfos.find((indicatorInfo) => indicatorInfo.id === indicatorId);
  }

  addIndicator(newIndicatorInfo: IndicatorInfoResponse) {
    return this.createStateDump({
      indicatorInfos: [...this.indicatorInfos, newIndicatorInfo],
      sections: {
        ...this._sections,
        [this.lastsectionId]: [...this._sections[this.lastsectionId], newIndicatorInfo.id],
      },
    });
  }

  addCustomForecastIndicator(customForecastIndicatorId: string) {
    return this.createStateDump({
      customForecastIndicatorIds: [...this.customForecastIndicatorIds, customForecastIndicatorId],
      sections: {
        ...this._sections,
        [this.lastsectionId]: [...this._sections[this.lastsectionId], customForecastIndicatorId],
      },
    });
  }

  deleteCustomForecastIndicator(customForecastIndicatorId: string) {
    return this.createStateDump({
      sections: this.deleteIndicatorFromSection(customForecastIndicatorId),
      customForecastIndicatorIds: this.customForecastIndicatorIds.filter((id) => id !== customForecastIndicatorId),
    });
  }

  updateName(indicatorBoardMetadataName: string) {
    return this.createStateDump({
      indicatorBoardMetadataName,
    });
  }

  deleteIndicator(indicatorId: string) {
    return this.createStateDump({
      indicatorInfos: this.indicatorInfos.filter((indicatorInfo) => indicatorInfo.id !== indicatorId),
      sections: this.deleteIndicatorFromSection(indicatorId),
    });
  }

  updateIndicatorIdsWithsectionIds(sections: { [key: string]: string[] }) {
    return this.createStateDump({
      sections: sections,
    });
  }

  addSection() {
    const copySection1 = [...this._sections['section1']];
    const element = copySection1.shift();

    const newSections = Object.keys(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, _, index) => {
      if (index === 0) {
        acc[`section2`] = copySection1;
        return acc;
      }
      acc[`section${index + 2}`] = [...this._sections[`section${index + 1}`]];
      return acc;
    }, {});

    newSections['section1'] = element ? [element] : [];

    return this.createStateDump({
      sections: newSections,
    });
  }

  deleteSection(sectionId: number) {
    const newSections = Object.keys(this._sections).reduce<{
      [key: string]: string[];
    }>((acc, key, index) => {
      if (index === sectionId) {
        acc[`section${index}`] = [...acc[`section${index}`], ...this._sections[`section${index + 1}`]];
      } else if (index < sectionId) {
        acc[`section${index + 1}`] = [...this._sections[`section${index + 1}`]];
      } else {
        acc[`section${index}`] = [...this._sections[`section${index + 1}`]];
      }

      return acc;
    }, {});

    return this.createStateDump({
      sections: newSections,
    });
  }
}

export const convertIndicatorBoardMetadata = (response: IndicatorBoardMetadataResponse) => {
  return new IndicatorBoardMetadata(response);
};

import { IndicatorBoardMetadata } from './indicator-board-metadata-view-model.service';

import {
  IndicatorBoardMetadataResponse,
  IndicatorInfoResponse,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

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

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }

  get names() {
    return this.map((metadata) => metadata.name);
  }

  iterate(callback: (metadata: IndicatorBoardMetadata) => IndicatorBoardMetadata): IndicatorBoardMetadataList {
    return convertIndicatorBoardMetadataList(this.map(callback));
  }

  findIndicatorBoardMetadataById(metadataId: string) {
    return this.find((metadata) => metadata.id === metadataId);
  }

  deleteIndicatorBoardMetadata(metadataId: string) {
    return convertIndicatorBoardMetadataList(this.filter((metadata) => metadata.id !== metadataId));
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
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.updateName(indicatorBoardMetadataName);
      }

      return metadata;
    });
  }

  deleteIndicatorFromMetadataById(metadataId: string | undefined, indicatorId: string) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.deleteIndicator(indicatorId);
      }

      return metadata;
    });
  }

  updateIndicatorIdsWithsectionIds(metadataId: string | undefined, sections: { [key: string]: string[] }) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.updateIndicatorIdsWithsectionIds(sections);
      }

      return metadata;
    });
  }

  addSectionToIndicatorBoardMetadata(metadataId: string | undefined) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.addSection();
      }

      return metadata;
    });
  }

  deleteSectionFromIndicatorBoardMetadata(metadataId: string | undefined, sectionId: number) {
    return this.iterate((metadata) => {
      if (metadata.id === metadataId) {
        return metadata.deleteSection(sectionId);
      }

      return metadata;
    });
  }
}
export const convertIndicatorBoardMetadataList = (response: IndicatorBoardMetadataResponse[]) => {
  return new IndicatorBoardMetadataList(response);
};

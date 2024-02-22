import {
  IndicatorBoardMetadataListResponse,
  IndicatorBoardMetadataResponse,
  IndicatorResponse,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export class Indicator {
  readonly ticker: string;
  readonly name: string;
  constructor({ ticker, name }: IndicatorResponse) {
    this.ticker = ticker;
    this.name = name;
  }
}

export class IndicatorBoardMetadata {
  readonly id: string;
  readonly name: string;
  readonly indicators: IndicatorResponse[];
  constructor({ id, name, indicators }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.name = name;
    this.indicators = indicators.map((indicator) => new Indicator(indicator));
  }
}

export class IndicatorBoardMetadataList {
  readonly metadataList: IndicatorBoardMetadata[];
  constructor({ metadataList }: IndicatorBoardMetadataListResponse) {
    this.metadataList = metadataList.map((metadata) => new IndicatorBoardMetadata(metadata));
  }

  get length() {
    return this.metadataList.length;
  }

  getMetadataById(id: string) {
    return this.metadataList.find((metadata) => metadata.id === id);
  }

  getMetadataByIndex(index: number): IndicatorBoardMetadata | undefined {
    return this.metadataList[index];
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.metadataList.length) {
          return {
            value: this.metadataList[index++],
            done: false,
          };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataListResponse) => {
  return new IndicatorBoardMetadataList(response);
};

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

export class IndicatorBoardMetadataList extends Array {
  constructor({ metadataList }: IndicatorBoardMetadataListResponse) {
    super();
    metadataList.forEach((metadata) => {
      this.push(new IndicatorBoardMetadata(metadata));
    });
  }

  static get [Symbol.species]() {
    return Array;
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataListResponse) => {
  return new IndicatorBoardMetadataList(response);
};

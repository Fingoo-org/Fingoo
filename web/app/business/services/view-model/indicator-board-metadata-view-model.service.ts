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
  // 여기는 response와 같아야함
  readonly id: string;
  readonly name: string;
  private tickers: Indicator[];
  constructor({ id, name, tickers }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.name = name;
    this.tickers = tickers.map((ticker) => new Indicator(ticker));
  }

  // 다른건 여기서 보내줘야함
  get indicators() {
    return this.tickers;
  }

  set indicators(indicators: Indicator[]) {
    this.tickers = indicators;
  }

  get formattedIndicatorBoardMetadata() {
    return {
      id: this.id,
      name: this.name,
      tickers: this.indicators,
    };
  }
}

export class IndicatorBoardMetadataList extends Array<IndicatorBoardMetadata> {
  constructor({ metadataList }: IndicatorBoardMetadataListResponse) {
    super();
    metadataList.forEach((metadata) => {
      this.push(new IndicatorBoardMetadata(metadata));
    });
  }

  static get [Symbol.species]() {
    return Array;
  }

  addIndicatorToMetadataById(metadataId: string | undefined, indicator: Indicator) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.indicators = [...metadata.indicators, indicator];
  }

  updateIndicatorBoardMetadatNameaById(metadataId: string | undefined, name: string) {
    const index = this.findIndex((metadata) => metadata.id === metadataId);
    if (index === -1) return;

    const metadata = this[index];

    this[index] = new IndicatorBoardMetadata({ ...metadata.formattedIndicatorBoardMetadata, name });
  }

  deleteIndicatorFromMetadataById(metadataId: string | undefined, indicatorKey: string) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.indicators = metadata.indicators.filter((indicator) => indicator.ticker !== indicatorKey);
  }

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataListResponse) => {
  return new IndicatorBoardMetadataList(response);
};

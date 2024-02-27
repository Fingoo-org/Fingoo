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
  readonly customForecastIndicatorIds: string[];
  // 변경된 부분은 private으로 client에서 못사용하게
  private tickers: Indicator[];

  constructor({ id, name, tickers, customForecastIndicatorIds }: IndicatorBoardMetadataResponse) {
    this.id = id;
    this.name = name;
    this.tickers = tickers.map((ticker) => new Indicator(ticker));
    this.customForecastIndicatorIds = customForecastIndicatorIds;
  }

  // 변경된 부분은 getter, setter로 변경에서 전처럼 사용하도록
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

  addIndicator(indicator: Indicator) {
    this.tickers = [...this.tickers, indicator];
  }

  deleteIndicator(indicatorKey: string) {
    this.tickers = this.tickers.filter((indicator) => indicator.ticker !== indicatorKey);
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

  deleteMetadata(metadataId: string) {
    const index = this.findIndex((metadata) => metadata.id === metadataId);
    if (index === -1) return;

    this.splice(index, 1);
  }

  addIndicatorToMetadataById(metadataId: string | undefined, indicator: Indicator) {
    const metadata = this.find((metadata) => metadata.id === metadataId);
    if (!metadata) return;

    metadata.addIndicator(indicator);
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

    metadata.deleteIndicator(indicatorKey);
  }

  get formattedIndicatorBoardMetadataList() {
    return this.map((metadata) => metadata.formattedIndicatorBoardMetadata);
  }
}

export const convertIndcatorBoardMetadataList = (response: IndicatorBoardMetadataListResponse) => {
  return new IndicatorBoardMetadataList(response);
};

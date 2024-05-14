export type SearchedSymbolType = {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: string;
  country: string;
  currency: string;
};

export class SearchedIndicatorsDto {
  searchedSymbol: SearchedSymbolType[];

  private constructor(searchedSymbol: SearchedSymbolType[]) {
    this.searchedSymbol = searchedSymbol;
  }

  static create(searchedSymbol: SearchedSymbolType[]): SearchedIndicatorsDto {
    return new SearchedIndicatorsDto(searchedSymbol);
  }
}

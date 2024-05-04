export interface SearchIndicatorIdBySymbolPort {
  searchIndicatorIdBySymbol(symbol: string): Promise<string>;
}

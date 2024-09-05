import { QuoteIndicatorFiftyTwoWeekData } from './quote-indicator.fifty-two-week-data.interface';

export interface IndicatorQuoteData {
  symbol: string;
  name: string;
  datetime: Date;
  open: string;
  high: string;
  low: string;
  close: string;
  change: string;
  percent_change: string;
  fifty_two_week: QuoteIndicatorFiftyTwoWeekData;
}

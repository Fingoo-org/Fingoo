import { QuoteIndicatorFiftyTwoWeekData } from '../interface/quote-indicator.fifty-two-week-data.interface';

export class QuoteIndicatorFiftyTwoWeekDto implements QuoteIndicatorFiftyTwoWeekData {
  low: string;
  high: string;
  low_change: string;
  high_change: string;
  low_change_percent: string;
  high_change_percent: string;
  range: string;

  constructor(fiftyTwoWeek: QuoteIndicatorFiftyTwoWeekDto) {
    this.low = fiftyTwoWeek.low;
    this.high = fiftyTwoWeek.high;
    this.low_change = fiftyTwoWeek.low_change;
    this.high_change = fiftyTwoWeek.high_change;
    this.low_change_percent = fiftyTwoWeek.low_change_percent;
    this.high_change_percent = fiftyTwoWeek.high_change_percent;
    this.range = fiftyTwoWeek.range;
  }
}

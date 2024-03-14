import { Interval } from '../../utils/type/type-definition';

export abstract class IndicatorValueManager<T> {
  public abstract calculateValues(boundValues: T[], identifier: string): T[];

  public abstract getCurrentDateString(value: T): string;

  public abstract resetDataStructure(): void;

  async adjustValuesByInterval(values: T[], interval: Interval): Promise<T[]> {
    if (interval == 'day') {
      return values;
    }

    const resultValues: T[] = [];
    values.map((value) => {
      const currentDate = this.formatStringToDate(this.getCurrentDateString(value));
      const identifier = this.createIdentifier(interval, currentDate);
      const boundValues = this.bindValues(values, interval, currentDate);
      const calculatedValues = this.calculateValues(boundValues, identifier);
      resultValues.push(...calculatedValues);
    });
    this.resetDataStructure();
    return resultValues;
  }

  public formatStringToDate(dateString: string): Date {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    return new Date(`${year}-${month}-${day}`);
  }

  public formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }

  public getDateXWeeksAgo(date: Date, weeksAgo: number): Date {
    const targetWeekNumber = this.getISOWeekNumber(date) - weeksAgo;
    const yearStart = this.getYearStart(date);
    const targetDate = new Date(yearStart.getTime() + (targetWeekNumber - 1) * 7 * 24 * 60 * 60 * 1000);

    targetDate.setDate(targetDate.getDate() - 1);
    return targetDate;
  }

  public getDateXMonthsAgo(date: Date, monthsAgo: number): Date {
    const targetDate = new Date(date);
    targetDate.setMonth(targetDate.getMonth() - monthsAgo);
    targetDate.setDate(1);
    return targetDate;
  }

  public getDateXYearsAgo(date: Date, yearsAgo: number): Date {
    const targetDate = new Date(date);
    targetDate.setFullYear(targetDate.getFullYear() - yearsAgo);
    targetDate.setDate(1);
    return targetDate;
  }

  private bindValues(values: T[], interval: Interval, currentDate: Date): T[] {
    return values.filter((value) => {
      const valueDate = this.formatStringToDate(this.getCurrentDateString(value));

      switch (interval) {
        case 'day':
          return true;
        case 'week':
          return this.checkSameWeek(currentDate, valueDate);
        case 'month':
          return this.checkSameMonth(currentDate, valueDate);
        case 'year':
          return this.checkSameYear(currentDate, valueDate);
      }
    });
  }

  private checkSameWeek(currentDate: Date, valueDate: Date) {
    return (
      currentDate.getFullYear() === valueDate.getFullYear() &&
      this.getISOWeekNumber(currentDate) === this.getISOWeekNumber(valueDate)
    );
  }

  private checkSameMonth(currentDate: Date, valueDate: Date) {
    return currentDate.getFullYear() === valueDate.getFullYear() && currentDate.getMonth() === valueDate.getMonth();
  }

  private checkSameYear(currentDate: Date, valueDate: Date) {
    return currentDate.getFullYear() === valueDate.getFullYear();
  }

  private createIdentifier(interval: Interval, currentDate: Date) {
    switch (interval) {
      case 'day':
        return currentDate.getDay().toString();
      case 'week':
        return `${currentDate.getFullYear()}-${this.getISOWeekNumber(currentDate)}`;
      case 'month':
        return currentDate.getFullYear().toString() + currentDate.getMonth().toString();
      case 'year':
        return currentDate.getFullYear().toString() + currentDate.getFullYear().toString();
    }
  }

  private getISOWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = this.getYearStart(d);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private getYearStart(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  }
}

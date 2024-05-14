export abstract class IndicatorValueManager<T> {
  public abstract calculateValues(boundValues: T[]): T[];

  public abstract getCurrentDateString(value: T): string;

  async convertIndicatorValueMonthToYear(values: T[]): Promise<T[]> {
    return this.calculateValues(values);
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
    targetDate.setMonth(0);
    targetDate.setDate(1);
    return targetDate;
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

export interface SaveIndicatorListPort {
  saveIndicatorList(count: number, country: string): Promise<void>;
}

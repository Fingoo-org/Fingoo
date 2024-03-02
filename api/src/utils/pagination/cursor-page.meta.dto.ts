export interface CursorPageMetaDtoParameters {
  total: number;
  hasNextData: boolean;
  cursor: string;
}

export class CursorPageMetaDto {
  readonly total: number;
  readonly hasNextData: boolean;
  readonly cursor: string;

  constructor({ total, hasNextData, cursor }: CursorPageMetaDtoParameters) {
    this.total = total;
    this.hasNextData = hasNextData;
    this.cursor = cursor;
  }
}

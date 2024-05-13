import { IndicatorDtoType, IndicatorType } from '../../../../../utils/type/type-definition';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(type: IndicatorType, cursorToken: number): Promise<CursorPageDto<IndicatorDtoType>>;
}

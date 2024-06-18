import { LiveEconomyDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-ecnomy.dto';

export class IndicatorFredMapper {
  static mapToIndicatorDto(indicatorDto, values): LiveEconomyDto {
    return LiveEconomyDto.create({
      indicatorId: indicatorDto.id,
      symbol: indicatorDto.symbol,
      interval: indicatorDto.frequency,
      type: indicatorDto.indicatorType,
      name: indicatorDto.name,
      totalCount: values.length,
      values: values,
    });
  }
}

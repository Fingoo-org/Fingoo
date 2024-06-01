import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsIndicatorType(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsIndicatorType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const validValues = [
            'stocks',
            'forex_pairs',
            'cryptocurrencies',
            'etf',
            'indices',
            'customForecastIndicator',
            'funds',
            'bonds',
            'economy',
            'none',
          ];
          return validValues.includes(value);
        },
        defaultMessage() {
          return '올바른 indicatorType 을 입력해주세요. (stocks, forex_pairs, cryptocurrencies, etf, indices, customForecastIndicator, funds, bonds, economy, none)';
        },
      },
    });
  };
}

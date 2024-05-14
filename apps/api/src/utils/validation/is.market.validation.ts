import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsMarket(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsMarket',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const validValues = ['KOSPI', 'KOSDAQ', 'NASDAQ', 'NYSE'];
          return validValues.includes(value);
        },
        defaultMessage() {
          return '[ERROR] 올바른 Market 을 입력해주세요.';
        },
      },
    });
  };
}

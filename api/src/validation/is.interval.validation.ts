import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsInterval(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsInterval',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const validValues = ['day', 'week', 'month', 'year'];
          return validValues.includes(value);
        },
        defaultMessage() {
          return "[ERROR] 올바른 interval 을 입력해주세요. ('day', 'week', 'month', 'year')";
        },
      },
    });
  };
}

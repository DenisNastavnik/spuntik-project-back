import {
  IsEmail,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsEmailFormat(errorMessage: string) {
  return function (object: Record<string, any>, propertyName: string) {
    IsEmail({}, { message: errorMessage })(object, propertyName);
  };
}

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string' || value.length < 6) {
      return false;
    }

    if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `The password must be at least 6 characters long and contain at least one letter and one digit`;
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Регулярное выражение для проверки номера телефона (формат: +12345678901)
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid phone number format. It should be in the format: +12345678901`;
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

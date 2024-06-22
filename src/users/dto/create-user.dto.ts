import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { IsEmailFormat, IsPhoneNumber, IsStrongPassword } from 'src/decorators/user.decorators';

export class CreateUserDto {
  @ApiProperty({ example: 'email@mail.ru', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  @IsEmailFormat('Invalid email format')
  readonly email: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    message:
      'The password must be at least 6 characters long and contain at least one letter and one digit',
  })
  readonly password: string;

  @ApiProperty({ example: 'Jonn', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ example: 'Smit', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({ example: '+79099093243', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber({
    message: 'Invalid phone number format. It should be in the format: +12345678901',
  })
  readonly phone_number: string;
}

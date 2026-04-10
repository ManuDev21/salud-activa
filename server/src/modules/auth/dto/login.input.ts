import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  correo: string;

  @Field()
  @IsNotEmpty()
  contrasena: string;
}

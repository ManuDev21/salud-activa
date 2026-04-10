import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity';

@InputType()
export class CreateUsuarioInput {
  @Field()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsNotEmpty()
  apellido: string;

  @Field()
  @IsEmail()
  correo: string;

  @Field()
  @IsNotEmpty()
  contrasena: string;

  @Field()
  @IsDateString()
  fecha_nacimiento: string;

  @Field(() => RolUsuario, { defaultValue: RolUsuario.USUARIO })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}

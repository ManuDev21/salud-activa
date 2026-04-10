import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class CreateVacunaInput {
  @Field(() => Int)
  @IsInt()
  usuario_id: number;

  @Field()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsNotEmpty()
  dosis_aplicada: string;

  @Field()
  @IsDateString()
  fecha_aplicacion: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  proxima_dosis_fecha?: string;

  @Field({ nullable: true })
  @IsOptional()
  notas?: string;
}

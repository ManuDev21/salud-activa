import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class CreateMedicamentoInput {
  @Field(() => Int)
  @IsInt()
  usuario_id: number;

  @Field()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsNotEmpty()
  dosis: string;

  @Field()
  @IsNotEmpty()
  frecuencia: string;

  @Field()
  @IsDateString()
  fecha_inicio: string;

  @Field()
  @IsDateString()
  fecha_fin: string;

  @Field({ nullable: true })
  @IsOptional()
  notas?: string;
}

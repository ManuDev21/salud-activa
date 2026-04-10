import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EstadoCita } from '../entities/cita-medica.entity';

@InputType()
export class CreateCitaInput {
  @Field(() => Int)
  @IsInt()
  usuario_id: number;

  @Field()
  @IsNotEmpty()
  medico: string;

  @Field()
  @IsNotEmpty()
  especialidad: string;

  @Field()
  @IsNotEmpty()
  lugar: string;

  @Field()
  @IsDateString()
  fecha_hora: string;

  @Field(() => EstadoCita, { defaultValue: EstadoCita.PENDIENTE })
  @IsEnum(EstadoCita)
  estado: EstadoCita;

  @Field({ nullable: true })
  @IsOptional()
  notas?: string;
}

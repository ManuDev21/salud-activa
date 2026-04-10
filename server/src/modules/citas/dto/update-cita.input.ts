import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCitaInput } from './create-cita.input';

@InputType()
export class UpdateCitaInput extends PartialType(CreateCitaInput) {
  @Field(() => Int)
  id: number;
}

import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateVacunaInput } from './create-vacuna.input';

@InputType()
export class UpdateVacunaInput extends PartialType(CreateVacunaInput) {
  @Field(() => Int)
  id: number;
}

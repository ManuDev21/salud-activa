import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateMedicamentoInput } from './create-medicamento.input';

@InputType()
export class UpdateMedicamentoInput extends PartialType(CreateMedicamentoInput) {
  @Field(() => Int)
  id: number;
}

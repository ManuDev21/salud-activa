import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt } from 'class-validator';

@InputType()
export class CreateFamiliarInput {
  @Field(() => Int)
  @IsInt()
  usuario_id: number;

  @Field(() => Int)
  @IsInt()
  familiar_id: number;

  @Field()
  @IsNotEmpty()
  parentesco: string;
}

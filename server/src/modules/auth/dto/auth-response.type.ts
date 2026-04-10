import { ObjectType, Field } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => Usuario)
  usuario: Usuario;
}

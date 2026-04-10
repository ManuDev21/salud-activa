import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(private readonly service: UsuariosService) {}

  @Query(() => [Usuario], { name: 'usuarios' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Usuario, { name: 'usuario' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Usuario)
  createUsuario(@Args('input') input: CreateUsuarioInput) {
    return this.service.create(input);
  }

  @Mutation(() => Usuario)
  updateUsuario(@Args('input') input: UpdateUsuarioInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}

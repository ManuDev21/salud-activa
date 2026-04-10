import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Familiar } from './entities/familiar.entity';
import { FamiliaresService } from './familiares.service';
import { CreateFamiliarInput } from './dto/create-familiar.input';

@Resolver(() => Familiar)
export class FamiliaresResolver {
  constructor(private readonly service: FamiliaresService) {}

  @Query(() => [Familiar], { name: 'familiares' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Familiar], { name: 'familiaresByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => Familiar)
  createFamiliar(@Args('input') input: CreateFamiliarInput) {
    return this.service.create(input);
  }

  @Mutation(() => Boolean)
  removeFamiliar(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Vacuna } from './entities/vacuna.entity';
import { VacunasService } from './vacunas.service';
import { CreateVacunaInput } from './dto/create-vacuna.input';
import { UpdateVacunaInput } from './dto/update-vacuna.input';

@Resolver(() => Vacuna)
export class VacunasResolver {
  constructor(private readonly service: VacunasService) {}

  @Query(() => [Vacuna], { name: 'vacunas' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Vacuna, { name: 'vacuna' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Query(() => [Vacuna], { name: 'vacunasByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => Vacuna)
  createVacuna(@Args('input') input: CreateVacunaInput) {
    return this.service.create(input);
  }

  @Mutation(() => Vacuna)
  updateVacuna(@Args('input') input: UpdateVacunaInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  removeVacuna(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}

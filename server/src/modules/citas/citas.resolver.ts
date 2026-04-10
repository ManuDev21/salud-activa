import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CitaMedica } from './entities/cita-medica.entity';
import { CitasService } from './citas.service';
import { CreateCitaInput } from './dto/create-cita.input';
import { UpdateCitaInput } from './dto/update-cita.input';

@Resolver(() => CitaMedica)
export class CitasResolver {
  constructor(private readonly service: CitasService) {}

  @Query(() => [CitaMedica], { name: 'citas' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => CitaMedica, { name: 'cita' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Query(() => [CitaMedica], { name: 'citasByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => CitaMedica)
  createCita(@Args('input') input: CreateCitaInput) {
    return this.service.create(input);
  }

  @Mutation(() => CitaMedica)
  updateCita(@Args('input') input: UpdateCitaInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  removeCita(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}

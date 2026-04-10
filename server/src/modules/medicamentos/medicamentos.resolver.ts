import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Medicamento } from './entities/medicamento.entity';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoInput } from './dto/create-medicamento.input';
import { UpdateMedicamentoInput } from './dto/update-medicamento.input';

@Resolver(() => Medicamento)
export class MedicamentosResolver {
  constructor(private readonly service: MedicamentosService) {}

  @Query(() => [Medicamento], { name: 'medicamentos' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Medicamento, { name: 'medicamento' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Query(() => [Medicamento], { name: 'medicamentosByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => Medicamento)
  createMedicamento(@Args('input') input: CreateMedicamentoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Medicamento)
  updateMedicamento(@Args('input') input: UpdateMedicamentoInput) {
    return this.service.update(input);
  }

  @Mutation(() => Boolean)
  removeMedicamento(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}

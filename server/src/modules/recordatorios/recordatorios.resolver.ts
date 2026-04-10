import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Recordatorio } from './entities/recordatorio.entity';
import { RecordatoriosService } from './recordatorios.service';

@Resolver(() => Recordatorio)
export class RecordatoriosResolver {
  constructor(private readonly service: RecordatoriosService) {}

  @Query(() => [Recordatorio], { name: 'recordatorios' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Recordatorio], { name: 'recordatoriosByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => Recordatorio)
  marcarRecordatorioEnviado(@Args('id', { type: () => Int }) id: number) {
    return this.service.marcarEnviado(id);
  }
}

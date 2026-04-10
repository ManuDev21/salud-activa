import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Alerta } from './entities/alerta.entity';
import { AlertasService } from './alertas.service';

@Resolver(() => Alerta)
export class AlertasResolver {
  constructor(private readonly service: AlertasService) {}

  @Query(() => [Alerta], { name: 'alertas' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Alerta], { name: 'alertasByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => Int }) usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Mutation(() => Alerta)
  marcarAlertaLeida(@Args('id', { type: () => Int }) id: number) {
    return this.service.marcarLeida(id);
  }
}

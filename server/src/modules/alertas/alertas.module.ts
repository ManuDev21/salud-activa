import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alerta } from './entities/alerta.entity';
import { Familiar } from '../familiares/entities/familiar.entity';
import { AlertasService } from './alertas.service';
import { AlertasResolver } from './alertas.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta, Familiar])],
  providers: [AlertasService, AlertasResolver],
  exports: [AlertasService],
})
export class AlertasModule {}

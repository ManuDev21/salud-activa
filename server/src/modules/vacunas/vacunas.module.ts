import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacuna } from './entities/vacuna.entity';
import { VacunasService } from './vacunas.service';
import { VacunasResolver } from './vacunas.resolver';
import { RecordatoriosModule } from '../recordatorios/recordatorios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacuna]),
    RecordatoriosModule,
  ],
  providers: [VacunasService, VacunasResolver],
  exports: [VacunasService],
})
export class VacunasModule {}

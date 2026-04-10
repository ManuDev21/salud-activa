import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { MedicamentosService } from './medicamentos.service';
import { MedicamentosResolver } from './medicamentos.resolver';
import { RecordatoriosModule } from '../recordatorios/recordatorios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medicamento]),
    RecordatoriosModule,
  ],
  providers: [MedicamentosService, MedicamentosResolver],
  exports: [MedicamentosService],
})
export class MedicamentosModule {}

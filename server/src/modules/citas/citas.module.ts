import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaMedica } from './entities/cita-medica.entity';
import { CitasService } from './citas.service';
import { CitasResolver } from './citas.resolver';
import { RecordatoriosModule } from '../recordatorios/recordatorios.module';
import { AlertasModule } from '../alertas/alertas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CitaMedica]),
    RecordatoriosModule,
    AlertasModule,
  ],
  providers: [CitasService, CitasResolver],
  exports: [CitasService],
})
export class CitasModule {}

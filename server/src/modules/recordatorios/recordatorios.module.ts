import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recordatorio } from './entities/recordatorio.entity';
import { RecordatoriosService } from './recordatorios.service';
import { RecordatoriosResolver } from './recordatorios.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Recordatorio])],
  providers: [RecordatoriosService, RecordatoriosResolver],
  exports: [RecordatoriosService],
})
export class RecordatoriosModule {}

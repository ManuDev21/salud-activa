import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Familiar } from './entities/familiar.entity';
import { FamiliaresService } from './familiares.service';
import { FamiliaresResolver } from './familiares.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Familiar])],
  providers: [FamiliaresService, FamiliaresResolver],
  exports: [FamiliaresService],
})
export class FamiliaresModule {}

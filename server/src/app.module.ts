import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CitasModule } from './modules/citas/citas.module';
import { MedicamentosModule } from './modules/medicamentos/medicamentos.module';
import { VacunasModule } from './modules/vacunas/vacunas.module';
import { FamiliaresModule } from './modules/familiares/familiares.module';
import { RecordatoriosModule } from './modules/recordatorios/recordatorios.module';
import { AlertasModule } from './modules/alertas/alertas.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production' || config.get('POSTGRES_HOST');
        const dbConfig: any = {
          type: isProduction ? 'postgres' : 'mariadb',
          host: config.get('POSTGRES_HOST') || config.get('DB_HOST', 'localhost'),
          port: parseInt(config.get('POSTGRES_PORT') || config.get('DB_PORT', '3308')),
          username: config.get('POSTGRES_USER') || config.get('DB_USER', 'root'),
          password: config.get('POSTGRES_PASSWORD') || config.get('DB_PASSWORD', 'root'),
          database: config.get('POSTGRES_DATABASE') || config.get('DB_NAME', 'smarthealth'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: config.get('DB_SYNC', 'false') === 'true',
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
        return dbConfig as any;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
    }),
    UsuariosModule,
    CitasModule,
    MedicamentosModule,
    VacunasModule,
    FamiliaresModule,
    RecordatoriosModule,
    AlertasModule,
    AuthModule,
  ],
})
export class AppModule {}

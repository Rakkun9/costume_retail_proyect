import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrendasModule } from './prendas/prendas.module';
import { ClientesModule } from './clientes/clientes.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ServiciosModule } from './servicios/servicios.module';
import { LavanderiaModule } from './lavanderia/lavanderia.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    PrendasModule,
    ClientesModule,
    EmpleadosModule,
    ServiciosModule,
    LavanderiaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

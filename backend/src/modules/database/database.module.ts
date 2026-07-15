import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // para asegurar que las variables de entorno existen
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: false,
        autoLoadEntities: true,
        logging: process.env.DB_LOGGING === 'true',
        logger: 'advanced-console',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

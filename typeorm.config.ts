import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.PG_HOST);

const configService = new ConfigService();

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  migrations: ['migrations/*.ts'],
  entities: ['**/*.entity.ts'],
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DB'),
};

switch (process.env.NODE_ENV) {
  case 'development':
    break;
  case 'test':
    Object.assign(dbConfig, {
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: configService.get('DATABASE_URL'),
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('unknown environment');
}

console.log({ dbConfig });

export default new DataSource(dbConfig);

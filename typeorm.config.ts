import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { resolve } from 'path';

const ENV_PATH = resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);

config({
  path: ENV_PATH,
});

const configService = new ConfigService();

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  migrations: ['migrations/*.ts'],
  entities: ['**/*.entity.js'],
  host: configService.get('PG_HOST'),
  port: +configService.get('PG_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DB'),
};

switch (process.env.NODE_ENV) {
  case 'development':
    break;
  case 'test':
    Object.assign(dbConfig, {
      entities: ['**/*.entity.ts'],
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

export default new DataSource(dbConfig);

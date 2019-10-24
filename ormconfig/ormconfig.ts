import config from '../src/backend/server/config';

export const connectionOptions: any = {
  entities: ['src/backend/data/**/models/*.ts'],
  type: config.databaseType,
  synchronize: config.databaseSynchronize,
  logging: config.databaseLogging,
  migrations: ['src/backend/data/migrations/**.ts'],
  cli: {
    migrationsDir: 'src/backend/data/migrations',
  },
  url: config.databaseUrl,
};

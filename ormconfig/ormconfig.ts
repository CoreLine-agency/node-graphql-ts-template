import config from '../src/server/config';

export const connectionOptions: any = {
  entities: ['src/data/**/models/*.ts'],
  type: config.databaseType,
  synchronize: config.databaseSynchronize,
  logging: config.databaseLogging,
  migrations: ['src/data/migrations/**.ts'],
  cli: {
    migrationsDir: 'src/data/migrations',
  },
  url: config.databaseUrl,
};

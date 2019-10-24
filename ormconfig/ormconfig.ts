import config from '../src/server/config';

export const connectionOptions: any = {
  entities: ['src/**/models/*.ts'],
  type: config.databaseType,
  synchronize: config.databaseSynchronize,
  logging: config.databaseLogging,
  migrations: ['src/migrations/**.ts'],
  cli: {
    migrationsDir: 'src//migrations',
  },
  url: config.databaseUrl,
};

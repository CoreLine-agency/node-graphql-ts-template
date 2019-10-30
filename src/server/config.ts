// tslint:disable: no-http-string

export default {
  databaseType: process.env.DATABASE_TYPE || 'postgres',
  databaseSynchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  databaseLogging: process.env.DATABASE_LOGGING === 'true',
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 5001,
  serverUrl: process.env.SERVER_URL || 'http://localhost:5001',
  cryptoSecret: process.env.CRYPTO_SECRET || 'secret',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  sentryDsn: process.env.SENTRY_DSN || '',
  databaseUrl: process.env.DATABASE_URL || '',
};

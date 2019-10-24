// tslint:disable no-console
import appRoot from 'app-root-path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import glob from 'glob';
import { GraphQLServer, Options } from 'graphql-yoga';
import path from 'path';
import Raven from 'raven';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { connectionOptions } from '../../ormconfig/ormconfig';
import { AuthorizationMiddleware } from '../authorization/AuthorizationMiddleware';
import config from './config';
import { createGraphqlContext } from './create-graphql-context';
import { formatError, ravenMiddleware } from './format-error';
import { isDevEnv } from './is-dev-env';
import { createGraphqlFile, createSchemaJsonFile } from './server-helpers';

Raven.config(config.sentryDsn, {
  environment: config.environment,
  shouldSendCallback: () => {
    return config.environment === 'production';
  },
}).install();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      appRoot.resolve('src/*/resolvers/*Resolver.ts'),
    ],
    globalMiddlewares: [AuthorizationMiddleware],
    validate: false,
  });
  createGraphqlFile(schema);
  await createSchemaJsonFile(schema);

  const server = new GraphQLServer({
    middlewares: [
      ravenMiddleware,
    ],
    schema,
    context: createGraphqlContext,
  });
  // Configure server options
  const serverOptions: Options = {
    endpoint: '/graphql',
    playground: '/playground',
    port: config.port,
    cors: {
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    },
    bodyParserOptions: {
      limit: '5mb',
    },
    formatError,
  };

  const app = server.express;

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(express.static(appRoot.resolve('public')));
  app.use(Raven.requestHandler());

  if (!isDevEnv()) {
    app.use(express.static(appRoot.resolve('build')));
  }

  await createConnection(connectionOptions);

  const initializers = glob.sync(path.join(__dirname, '../*/-controller.ts'))
    .map(modulePath => require(modulePath)) // tslint:disable-line:non-literal-require
    .map(module => module.default)
    .filter(initializer => initializer);

  initializers.forEach(initializeController => initializeController(app));

  await server.start(serverOptions, ({ playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${config.port}${playground}`,
    );
  });
}

Raven.context(async () => {
  await bootstrap();
}).catch(console.error);

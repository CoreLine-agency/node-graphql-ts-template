// tslint:disable no-console
import appRoot from 'app-root-path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import glob from 'glob';
import { GraphQLServer, Options } from 'graphql-yoga';
import Raven from 'raven';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import env from 'env-var';

import { connectionOptions } from '../../ormconfig/ormconfig';
import { AuthorizationMiddleware } from '../authorization/AuthorizationMiddleware';
import { createGraphqlContext } from './create-graphql-context';
import { formatError, ravenMiddleware } from './format-error';
import { isDevEnv } from './is-dev-env';
import { createGraphqlFile, createSchemaJsonFile } from './server-helpers';

const NODE_ENV = env.get('NODE_ENV').required().asString();
const PORT = env.get('PORT', '5001').asIntPositive();
const SENTRY_DSN = env.get('SENTRY_DSN').asString();

Raven.config(SENTRY_DSN, {
  environment: NODE_ENV,
  shouldSendCallback: () => {
    return NODE_ENV === 'production';
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
    port: PORT,
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

  const initializers = glob.sync(appRoot.resolve('src/*/*-controller.ts'))
    .map(modulePath => require(modulePath)) // tslint:disable-line:non-literal-require
    .map(module => module.default)
    .filter(initializer => initializer);

  initializers.forEach(initializeController => initializeController(app));

  await server.start(serverOptions, ({ playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${PORT}${playground}`,
    );
  });
}

Raven.context(async () => {
  await bootstrap();
}).catch(console.error);

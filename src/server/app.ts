// tslint:disable no-console
import * as appRoot from 'app-root-path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { GraphQLServer, Options } from 'graphql-yoga';
import * as Raven from 'raven';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { connectionOptions } from '../../ormconfig/ormconfig';
import { AuthorizationMiddleware } from '../authorization/AuthorizationMiddleware';
import config from './config';
import { createGraphqlContext } from './create-graphql-context';
import { formatError, ravenMiddleware } from './format-error';
import { createGraphqlFile, createSchemaJsonFile } from './server-helpers';
import { isDevEnv } from './is-dev-env';

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

  await server.start(serverOptions, ({ playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${config.port}${playground}`,
    );
  });
}

Raven.context(async () => {
  await bootstrap();
}).catch(console.error);

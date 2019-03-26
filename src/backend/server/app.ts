// tslint:disable no-console
import * as appRoot from 'app-root-path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as asyncWrap from 'express-async-wrapper';
import { GraphQLServer, Options } from 'graphql-yoga';
import * as jwt from 'jsonwebtoken';
import * as Raven from 'raven';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnection } from 'typeorm';

import { connectionOptions } from '../../../ormconfig/ormconfig';
import { IRequestContext } from '../data/IRequestContext';
import { AuthorizationMiddleware } from '../utils/auth/AuthorizationMiddleware';
import { IToken } from '../utils/auth/IToken';
import config from './config';
import { formatError, ravenMiddleware } from './format-error';
import { createGraphqlFile, createSchemaJsonFile } from './server-helpers';
import { getFile, isDevEnv } from './utils';

Raven.config(config.sentryDsn, {
  environment: config.environment,
  shouldSendCallback: () => {
    return config.environment === 'production';
  },
}).install();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      appRoot.resolve('src/backend/data/resolvers/*.ts'),
      appRoot.resolve('src/backend/data/field-resolvers/*.ts'),
    ],
    globalMiddlewares: [AuthorizationMiddleware],
  });
  createGraphqlFile(schema);
  await createSchemaJsonFile(schema);

  const server = new GraphQLServer({
    middlewares: [
      ravenMiddleware,
    ],
    schema,
    context(context: IRequestContext): IRequestContext {
      const { request, response } = context;
      const connection = getConnection();
      const em = connection.manager;
      const ret: IRequestContext = { request, response, em, modelsToSave: [] };
      const token = request.headers.token || request.cookies.token;
      if (!token) {
        return ret;
      }
      try {
        const auth = jwt.verify(token, config.jwtSecret) as IToken;
        if (!auth.user.id || !auth.user.role) {
          return ret;
        }

        return { ...ret, auth };
      } catch (e) {
        return ret;
      }
    },
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
  app.get('/files/:slug', asyncWrap(getFile));

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

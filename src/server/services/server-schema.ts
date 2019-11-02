import {buildSchema} from "type-graphql";
import appRoot from "app-root-path";
import {AuthorizationMiddleware} from "../../authorization/AuthorizationMiddleware";
import {graphql} from "graphql";
import {createGraphqlContext} from "../create-graphql-context";
import {IRequestContext} from "../../shared/IRequestContext";

async function buildServerSchema() {
  return buildSchema({
    resolvers: [
      appRoot.resolve('src/*/resolvers/*Resolver.ts'),
    ],
    globalMiddlewares: [AuthorizationMiddleware],
    validate: false,
  });
}

const schemaPromise = buildServerSchema();

export function getServerSchema() {
  return schemaPromise;
}

export async function executeGraphqlQuery(query: string, root: object, context: any) {
  return graphql(await getServerSchema(), query, root, createGraphqlContext(context));
}

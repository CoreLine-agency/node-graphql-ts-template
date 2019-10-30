import fs from 'fs';
import { graphql, GraphQLSchema, introspectionQuery, printSchema } from 'graphql';
import appRoot from 'app-root-path';

export function createGraphqlFile(schema: GraphQLSchema) {
  const stringSchema = printSchema(schema);

  fs.writeFileSync(appRoot.resolve('graphql.graphql'), stringSchema, {
    encoding: 'utf8',
  });
}

export async function createSchemaJsonFile(schema: GraphQLSchema) {
  const json = await graphql(schema, introspectionQuery);
  const stringSchema = JSON.stringify(json, null, 2);

  fs.writeFileSync(appRoot.resolve('graphql.schema.json'), stringSchema, {
    encoding: 'utf8',
  });
}

import * as fs from 'fs';
import { graphql, GraphQLSchema, introspectionQuery, printSchema } from 'graphql';

export function createGraphqlFile(schema: GraphQLSchema) {
  const stringSchema = printSchema(schema);

  fs.writeFileSync(`${__dirname}/../../../graphql.graphql`, stringSchema, {
    encoding: 'utf8',
  });
}

export async function createSchemaJsonFile(schema: GraphQLSchema) {
  const json = await graphql(schema, introspectionQuery);
  const stringSchema = JSON.stringify(json, null, 2);

  fs.writeFileSync(`${__dirname}/../../../graphql.schema.json`, stringSchema, {
    encoding: 'utf8',
  });
}

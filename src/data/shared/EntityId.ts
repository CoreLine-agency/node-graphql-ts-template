import { GraphQLScalarType, Kind } from 'graphql';

export type EntityId = number;

export const EntityIdScalar = new GraphQLScalarType({
  name: 'EntityId',
  description: 'ID scalar type',
  parseValue(value: string) {
    return parseInt(value, 10); // value from the client input variables
  },
  serialize(value: EntityId) {
    return value.toString(); // value sent to the client
  },
  parseLiteral(ast): number | null {
    if (ast.kind === Kind.STRING) {
      return parseInt(ast.value, 10); // value from the client query
    }

    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }

    return null;
  },
});

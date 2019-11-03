import _ from 'lodash';
import {executeGraphqlQuery} from "../../server/services/server-schema";
import {Field, IntrospectionRoot} from "./introspection-types";

export function isScalar(field: Field) {
  const kind = field.type.ofType && field.type.ofType.kind;
  return kind === 'SCALAR';
}

export function selectScalarFields(data: IntrospectionRoot): Array<string> {
  const { fields } = data.__type;
  return fields.filter(isScalar).map(field => field.name);
}

export async function introspectType(type: string, ctx: any): Promise<IntrospectionRoot> {
  const introspectionQuery = `
    query Q3 {
      __type(name: "${type}") {
        kind
        name
        fields {
          name
          type { ofType { kind } kind }
        }
      }
    }`;

  return await executeGraphqlQuery(introspectionQuery, {}, ctx);
}

export async function getScalarFieldsSelector(type: string, ctx) {
  const introspectData = await introspectType(type, ctx);
  const scalarFields = selectScalarFields(introspectData);
  return scalarFields.join('\n');
}

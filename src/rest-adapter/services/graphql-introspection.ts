import {executeGraphqlQuery} from "../../server/services/server-schema";
import {Field, IntrospectionRoot} from "./introspection-types";

export function isScalar(field: Field) {
  const kind = field.type.ofType && field.type.ofType.kind;
  return kind === 'SCALAR';
}

export function containsIdAsObject(field: Field) {
  return (
    field.type?.ofType?.fields?.map(f => f.name).includes('id') ||
    field.type?.fields?.map(f => f.name).includes('id')
  );
}

export function containsId(field: Field) {
  return containsIdAsObject(field);
}

export function selectScalarFields(data: IntrospectionRoot): Array<string> {
  const { fields } = data.__type;
  return fields.filter(isScalar).map(field => field.name);
}

export async function introspectType(type: string, ctx: any): Promise<IntrospectionRoot> {
  const introspectionQuery = `
    query Q1 {
      __type(name: "${type}") {
        kind
        name
        fields {
          name
          type { 
            ofType { kind fields { name } ofType { ofType { name fields { name } } }} 
            kind
            fields { name }
          }
        }
      }
    }`;

  return await executeGraphqlQuery(introspectionQuery, {}, ctx);
}

export async function getFieldsSelector(type: string, ctx) {
  const introspectData = await introspectType(type, ctx);
  const scalarFields = selectScalarFields(introspectData);
  const referenceFields = introspectData
    .__type
    .fields
    .filter(containsId)
    .map(f => f.name)
    .map(name => `${name}{ id }`);

  return [...scalarFields, ...referenceFields].join('\n');
}

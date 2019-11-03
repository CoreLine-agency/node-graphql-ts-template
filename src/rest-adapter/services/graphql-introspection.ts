import {executeGraphqlQuery} from "../../server/services/server-schema";
import {IntrospectionRoot} from "./introspection-types";

const json = JSON.parse(`
{
  "data": {
    "__type": {
      "kind": "OBJECT",
      "name": "User",
      "fields": [
        {
          "name": "id",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "email",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "firstName",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "lastName",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "posts",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "profileImage",
          "type": {
            "kind": "OBJECT",
            "fields": [
              {
                "name": "id"
              },
              {
                "name": "contentBase64"
              },
              {
                "name": "post"
              },
              {
                "name": "user"
              },
              {
                "name": "createdAt"
              },
              {
                "name": "updatedAt"
              },
              {
                "name": "url"
              },
              {
                "name": "thumbUrl"
              }
            ]
          }
        },
        {
          "name": "createdAt",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        },
        {
          "name": "updatedAt",
          "type": {
            "kind": "NON_NULL",
            "fields": null
          }
        }
      ]
    }
  }
}`);

export function selectScalarFields(data: IntrospectionRoot): Array<string> {
  const { fields } = data.__type;
  return fields.filter(field => field.type.ofType && field.type.ofType.name).map(field => field.name);
}

export async function introspectType(type: string, ctx: any): Promise<IntrospectionRoot> {
  const introspectionQuery = `
    query Q1 {
      __type(name: "${type}") {
          kind
          name
          fields {
            name
            type { name ofType { name }} 
          }
        }
      }
    `;

  return (await executeGraphqlQuery(introspectionQuery, {}, ctx));
}

export async function getScalarFieldsSelector(type: string, ctx) {
  const introspectData = await introspectType(type, ctx);
  const scalarFields = selectScalarFields(introspectData);
  return scalarFields.join('\n');
}

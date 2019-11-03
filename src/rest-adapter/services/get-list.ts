import express from "express";
import pluralize from 'pluralize';
import _ from 'lodash';
import cleanDeep from 'clean-deep';
import {executeGraphqlQuery} from "../../server/services/server-schema";
import {getFieldsSelector} from "./graphql-introspection";
import {flattenId} from "./flatten-id";

function pascalCase(x: string) {
  return _.upperFirst(_.camelCase(x));
}

function buildSearchArgs(query) {
  const {
    _start: start = 0,
    _end: end = 100,
    _sort: sort = 'id',
    _order: order = 'ASC',
    ...fields
  } = query;

  const take = parseInt(end) - parseInt(start);
  return `(take: ${take}, skip: ${start}, order: { ${sort}: ${order} })`;
}

export async function getList(request: express.Request, response: express.Response) {
  const { resource } = request.params;
  const typeName = pascalCase(resource);
  const searchKey = `search${typeName}`;


  const userFields = await getFieldsSelector(pluralize.singular(typeName), { request, response });
  const searchQuery = `
    query {
      ${searchKey}${buildSearchArgs(request.query)}{
        total
        items {
          $SCALAR_FIELDS
        }
      }
    }
  `;
  const query = searchQuery.replace('$SCALAR_FIELDS', userFields);

  const data = await executeGraphqlQuery(query,{}, { request, response });
  const { items, total } = data[searchKey];

  response.header('X-Total-Count', total);
  response.json(cleanDeep(items.map(flattenId)));
}

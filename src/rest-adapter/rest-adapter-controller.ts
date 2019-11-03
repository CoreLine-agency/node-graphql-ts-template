import express from "express";
import asyncWrapper from 'express-async-wrapper';
import pluralize from 'pluralize';
import _ from 'lodash';
import {executeGraphqlQuery} from "../server/services/server-schema";
import {getScalarFieldsSelector} from "./services/graphql-introspection";

function pascalCase(x: string) {
  return _.upperFirst(_.camelCase(x));
}

function buildSearchArgs(query) {
  const { _start: start, _end: end } = query;
  if (!start || !end) {
    return '';
  }

  const take = parseInt(end) - parseInt(start);
  return `(take: ${take}, skip: ${start})`;
}

export async function getList(request: express.Request, response: express.Response) {
  const { resource } = request.params;
  const typeName = pascalCase(resource);
  const searchKey = `search${typeName}`;


  const userFields = await getScalarFieldsSelector(pluralize.singular(typeName), { request, response });
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
  response.json(items);
}

export default (app: express.Application) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    next();
  });

  app.get('/rest/:resource', asyncWrapper(getList));
}

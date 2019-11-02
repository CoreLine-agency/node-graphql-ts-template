import express from "express";
import asyncWrapper from 'express-async-wrapper';
import {executeGraphqlQuery} from "../server/services/server-schema";

const searchUsersQuery = `
query {
  searchUsers {
    total
    items {
      id
      email
    }
  }
}`;

export async function getList(request: express.Request, response: express.Response) {
  const { data, errors } = await executeGraphqlQuery(searchUsersQuery, {}, { request, response });
  if (errors) {
    console.log('errors', errors);
    response.json(errors);
    return;
  }
  const items = data && data.searchUsers.items;
  const total = data && data.searchUsers.total;
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

import express from "express";
import asyncWrapper from 'express-async-wrapper';
import {getList} from "./services/get-list";

export default (app: express.Application) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    next();
  });

  app.get('/rest/:resource', asyncWrapper(getList));
}

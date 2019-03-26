import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { IToken } from '../utils/auth/IToken';

interface IRequest extends Request {
  headers: {
    token?: string;
  };
}

export interface IRequestContext {
  em: EntityManager;
  request: IRequest;
  response: Response;
  auth?: IToken;
  modelsToSave: Array<object>;
}

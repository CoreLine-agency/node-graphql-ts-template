import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { User } from '../User/models/User';
import { IToken } from '../authorization/IToken';

interface IRequest extends Request {
  headers: {
    token?: string;
    Authorization: string;
  };
}

export interface IRequestContext {
  em: EntityManager;
  request: IRequest;
  response: Response;
  auth?: IToken;
  modelsToSave: Array<object>;
  user?: Promise<User>;
}

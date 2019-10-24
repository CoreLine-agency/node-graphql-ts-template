import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { IToken } from '../authorization/IToken';
import { User } from '../user/models/User';

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

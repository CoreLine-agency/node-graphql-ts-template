import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import env from 'env-var';

const JWT_SECRET = env.get('JWT_SECRET').required().asString();

import { IToken } from '../authorization/IToken';
import { IRequestContext } from '../shared/IRequestContext';
import { User } from '../user/models/User';

export function createGraphqlContext(context: IRequestContext): IRequestContext {
  const { request, response } = context;
  const connection = getConnection();
  const em = connection.manager;
  const ret: IRequestContext = { request, response, em, modelsToSave: [] };
  const token = request.headers.token || request.headers.Authorization || request.cookies.token;
  if (!token) {
    return ret;
  }
  try {
    const auth = jwt.verify(token, JWT_SECRET) as IToken;
    if (!auth.user.id || !auth.user.role) {
      return ret;
    }
    const user = em.findOneOrFail(User, { id: auth.user.id });

    return { ...ret, auth, user };
  } catch (e) {
    return ret;
  }
}

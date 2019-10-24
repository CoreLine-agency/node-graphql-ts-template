import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

import { IRequestContext } from '../../data/IRequestContext';
import { assertCanRead } from './auth-checkers';

export class AuthorizationMiddleware implements MiddlewareInterface<IRequestContext> {
  public async use({ context, info, root }: ResolverData<IRequestContext>, next: NextFn) {
    await assertCanRead(root, context, info.fieldName);
    const result = await next();

    return assertCanRead(result, context);
  }
}

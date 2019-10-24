import { lowerFirst } from 'lodash';

import { ISingleErModel } from './model-types';

export function generateAuthChecker(model: ISingleErModel) {
  const { name } = model;

  const rolePath = name === 'User' ?
  '../enums/UserRole' :
  `../../User/enums/UserRole`;

  return (
`import { IAuthorizationChecker } from '../../../utils/auth/IAuthorizationChecker';
import { IRequestContext } from '../../IRequestContext';
import { UserRole } from '${rolePath}';
import { ${name} } from '../models/${name}';

export class ${name}Auth implements IAuthorizationChecker {
  public constructor(private ${lowerFirst(name)}: ${name}) {
  }

  public async canRead(ctx: IRequestContext, field?: string) {
    return true;
  }

  public async canManage(ctx: IRequestContext) {
    const { auth } = ctx;
    if (!auth) {
      return false;
    }

    if (auth.user.role === UserRole.ADMIN) {
      return true;
    }

    return false;
  }

  public async canPersist(ctx: IRequestContext) {
    return this.canManage(ctx);
  }

  public async canUpdate(ctx: IRequestContext) {
    return this.canManage(ctx);
  }

  public async canDelete(ctx: IRequestContext) {
    return this.canManage(ctx);
  }
}
`);
}

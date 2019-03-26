import { IAuthorizationChecker } from '../../utils/auth/IAuthorizationChecker';
import { UserRole } from '../enums/UserRole';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

export class UserAuth implements IAuthorizationChecker {
  public constructor(private user: User) {
  }

  public async canRead(ctx: IRequestContext, field: string) {
    const { auth } = ctx;
    if (field !== 'email') {
      return true;
    }

    if (!auth) {
      return false;
    }

    return auth.user.role === UserRole.ADMIN || auth.user.id === this.user.id;
  }

  public async canManage(ctx: IRequestContext) {
    const { auth } = ctx;
    if (!auth) {
      return false;
    }

    if (auth.user.role === UserRole.ADMIN) {
      return true;
    }

    return auth.user.id === this.user.id;
  }

  public async canPersist(ctx: IRequestContext) {
    return true;
  }

  public async canUpdate(ctx: IRequestContext) {
    return this.canManage(ctx);
  }

  public async canDelete(ctx: IRequestContext) {
    return this.canManage(ctx);
  }
}

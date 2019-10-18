import { IRequestContext } from 'backend/data/IRequestContext';
import { UserRole } from 'backend/data/Talent/enums/UserRole';
import { IAuthorizationChecker } from 'backend/utils/auth/IAuthorizationChecker';
import { Talent } from '../models/Talent';

export class TalentAuth implements IAuthorizationChecker {
  public constructor(private talent: Talent) {
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
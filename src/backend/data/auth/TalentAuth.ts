import { IAuthorizationChecker } from '../../utils/auth/IAuthorizationChecker';
import { UserRole } from '../enums/UserRole';
import { IRequestContext } from '../IRequestContext';
import { Talent } from '../models/Talent';

export class TalentAuth implements IAuthorizationChecker {
  public constructor(private talent: Talent) {
  }

  public async canRead(ctx: IRequestContext, field?: string) {
    return true;
  }

  public async canManage(ctx: IRequestContext) {
    // const { auth } = ctx;
    // if (!auth) {
    //   return false;
    // }

    // if (auth.user.role === UserRole.ADMIN) {
    //   return true;
    // }

    // return false;

    return true;
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

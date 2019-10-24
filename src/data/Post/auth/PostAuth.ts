import { IAuthorizationChecker } from '../../../utils/auth/IAuthorizationChecker';
import { IRequestContext } from '../../shared/IRequestContext';
import { UserRole } from '../../User/enums/UserRole';
import { Post } from '../models/Post';

export class PostAuth implements IAuthorizationChecker {
  public constructor(private post: Post) {
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

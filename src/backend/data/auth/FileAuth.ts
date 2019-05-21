import { IAuthorizationChecker } from '../../utils/auth/IAuthorizationChecker';
import { UserRole } from '../enums/UserRole';
import { IRequestContext } from '../IRequestContext';
import { File } from '../models/File';

export class FileAuth implements IAuthorizationChecker {
  public constructor(private file: File) {
  }

  public async canRead(ctx: IRequestContext, field: string) {
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
    return true;
  }

  public async canUpdate(ctx: IRequestContext) {
    return this.canManage(ctx);
  }

  public async canDelete(ctx: IRequestContext) {
    return this.canManage(ctx);
  }
}

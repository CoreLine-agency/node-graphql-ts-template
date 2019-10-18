import { UserRole } from 'backend/data/Agent/enums/UserRole';
import { IRequestContext } from 'backend/data/IRequestContext';
import { IAuthorizationChecker } from 'backend/utils/auth/IAuthorizationChecker';
import { Agent } from '../models/Agent';

export class AgentAuth implements IAuthorizationChecker {
  public constructor(private agent: Agent) {
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
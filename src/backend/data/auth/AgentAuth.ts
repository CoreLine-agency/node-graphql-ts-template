import { IAuthorizationChecker } from '../../utils/auth/IAuthorizationChecker';
import { UserRole } from '../enums/UserRole';
import { IRequestContext } from '../IRequestContext';
import { Agent } from '../models/Agent';

export class AgentAuth implements IAuthorizationChecker {
  public constructor(private agent: Agent) {
  }

  public async canRead(ctx: IRequestContext, field?: string) {
    return true;
  }

  public async canManage(ctx: IRequestContext) {
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

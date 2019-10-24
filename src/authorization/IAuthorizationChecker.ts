import { IRequestContext } from '../shared/IRequestContext';

export interface IAuthorizationChecker {
  canRead(ctx: IRequestContext, field?: string): Promise<boolean>;
  canPersist(ctx: IRequestContext): Promise<boolean>;
  canUpdate(ctx: IRequestContext): Promise<boolean>;
  canDelete(ctx: IRequestContext): Promise<boolean>;
}

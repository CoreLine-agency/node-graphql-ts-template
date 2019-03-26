import { IAuthorizationChecker } from './IAuthorizationChecker';

export interface IAuthorizable {
  authorizationChecker: IAuthorizationChecker;
}

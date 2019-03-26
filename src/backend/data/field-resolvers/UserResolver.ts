import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';

import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

@Resolver(User)
export class UserResolver {
  @FieldResolver((returns) => String)
  public async fullName(
    @Root() user: User,
    @Ctx() ctx: IRequestContext,
  ): Promise<string> {
    return `${user.firstName.trim()} ${user.lastName.trim()}`.trim();
  }
}

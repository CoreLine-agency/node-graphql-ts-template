import {FieldResolver, Resolver, Root} from 'type-graphql';

import { User } from '../models/User';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  public fullName(@Root() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }
}

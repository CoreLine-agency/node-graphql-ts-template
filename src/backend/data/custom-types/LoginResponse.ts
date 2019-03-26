import { Field, ObjectType } from 'type-graphql';
import { User } from '../models/User';

@ObjectType()
export class LoginResponse {
  public constructor(token: string, user: User) {
    this.token = token;
    this.user = user;
  }

  @Field()
  public token: string;

  @Field()
  public user: User;
}

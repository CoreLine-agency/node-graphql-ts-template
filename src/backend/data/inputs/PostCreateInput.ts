/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';

import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class PostCreateInput {
  @Field(() => String)
  public content: string;

  @Field(() => String)
  public title: string;

  @Field(() => UserNestedInput)
  public author: UserNestedInput;

  // <keep-methods>
  // </keep-methods>
}

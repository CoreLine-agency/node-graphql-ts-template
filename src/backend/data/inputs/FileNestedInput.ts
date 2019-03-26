/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';

import { PostNestedInput } from './PostNestedInput';
import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class FileNestedInput {
  @Field(() => EntityIdScalar, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public contentBase64?: string | null;

  @Field(() => PostNestedInput, { nullable: true })
  public post?: PostNestedInput | null;

  @Field(() => UserNestedInput, { nullable: true })
  public user?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}

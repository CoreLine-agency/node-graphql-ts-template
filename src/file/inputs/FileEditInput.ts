/* eslint-disable @typescript-eslint/no-unused-vars */
/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../../shared/EntityId';

import { PostNestedInput } from '../../post/inputs/PostNestedInput'
import { UserNestedInput } from '../../user/inputs/UserNestedInput'

// <keep-imports>
// </keep-imports>

@InputType()
export class FileEditInput {
  @Field(() => EntityIdScalar, )
  public id: EntityId;

  @Field(() => String, {"nullable":true})
  public contentBase64?: string | null;

  @Field(() => PostNestedInput, {"nullable":true})
  public post?: PostNestedInput | null;

  @Field(() => UserNestedInput, {"nullable":true})
  public user?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}

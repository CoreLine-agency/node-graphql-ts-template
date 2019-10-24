/* eslint-disable @typescript-eslint/no-unused-vars */
/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../../shared/EntityId';
import { UserRole } from '../enums/UserRole';
import { FileNestedInput } from '../../file/inputs/FileNestedInput'

// <keep-imports>
// </keep-imports>

@InputType()
export class UserEditInput {
  @Field(() => EntityIdScalar, )
  public id: EntityId;

  @Field(() => String, {"nullable":true})
  public email?: string | null;

  @Field(() => String, {"nullable":true})
  public password?: string | null;

  @Field(() => String, {"nullable":true})
  public firstName?: string | null;

  @Field(() => String, {"nullable":true})
  public lastName?: string | null;

  @Field(() => FileNestedInput, {"nullable":true})
  public profileImage?: FileNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}

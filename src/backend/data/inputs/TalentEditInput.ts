/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';

import { AgentNestedInput } from './AgentNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class TalentEditInput {
  @Field(() => EntityIdScalar)
  public id: EntityId;

  @Field(() => String, { nullable: true })
  public firstName?: string | null;

  @Field(() => String, { nullable: true })
  public lastName?: string | null;

  @Field(() => AgentNestedInput, { nullable: true })
  public agent?: AgentNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
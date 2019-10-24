import { Field, InputType } from 'type-graphql';
import { EntityId, EntityIdScalar } from './EntityId';

@InputType()
export class ReferenceSearchInput {
  @Field(() => EntityIdScalar, { nullable: true })
  public id?: EntityId;
}

import { Field, InputType } from 'type-graphql';
import { EntityId, EntityIdScalar } from '../shared/EntityId';

@InputType()
export class ReferenceSearchInput {
  @Field(() => EntityIdScalar, { nullable: true })
  public id?: EntityId;
}

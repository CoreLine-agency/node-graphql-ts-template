import { Resolver, Root } from 'type-graphql';

import { Talent } from '../models/Talent';

@Resolver(Talent)
export class TalentResolver {
  public async fullName(@Root() talent: Talent) {
    return `${talent.firstName} ${talent.lastName}`;
  }
}

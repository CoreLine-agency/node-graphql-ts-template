import { ISingleErModel } from './model-types';

export function generateResolver(model: ISingleErModel) {
  return (
`import { Resolver } from 'type-graphql';

import { ${model.name} } from '../models/${model.name}';

@Resolver(${model.name})
export class ${model.name}Resolver {
}
`);
}

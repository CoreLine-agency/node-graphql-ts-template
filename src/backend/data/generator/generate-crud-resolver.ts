// tslint:disable max-line-length
import { lowerFirst } from 'lodash';
import { plural } from 'pluralize';
import { ISingleErModel } from './model-types';

export function generateCrudResolver(model: ISingleErModel) {
  const modelName = model.name;
  const resourceName = lowerFirst(modelName);

  return (
    `// tslint:disable max-line-length
import { Arg, Args, Mutation, Query, Info, ID, Ctx, Resolver, Root, FieldResolver, Int } from 'type-graphql';

import { ${modelName} } from '../models/${modelName}';
import { ${modelName}CreateInput } from '../inputs/${modelName}CreateInput';
import { ${modelName}EditInput } from '../inputs/${modelName}EditInput';
import { ${modelName}SearchInput } from '../inputs/${modelName}SearchInput';
import { ${modelName}SearchOrderInput } from '../inputs/${modelName}SearchOrderInput';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId, EntityIdScalar } from '../EntityId';
import { IRequestContext } from '../IRequestContext';
import { addEagerFlags } from '../../utils/add-eager-flags';
import * as auth from '../../utils/auth/auth-checkers';
import { PaginatedResponse } from '../PaginationResponse';


// <keep-imports>
// </keep-imports>

const Paginated${modelName}Response = PaginatedResponse(${modelName});

@Resolver(${modelName})
export class ${modelName}CrudResolver {
  @Query((returns) => ${modelName})
  async ${resourceName}(@Arg('id', () => EntityIdScalar) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.findOneOrFail(${modelName}, id, getFindOptions(${modelName}, info)));
  }

  @Query(() => Paginated${modelName}Response)
  public async search${plural(modelName)}(
    @Arg('search') search: ${modelName}SearchInput,
    @Arg('skip', () => Int, { nullable: true }) skip: number = 0,
    @Arg('take', () => Int, { nullable: true }) take: number = 25,
    @Arg('order', () => [${modelName}SearchOrderInput], { nullable: true }) order: Array<${modelName}SearchOrderInput> = [],
    @Info() info,
    @Ctx() ctx: IRequestContext,
  ) {
    const [items, total] = addEagerFlags(await ctx.em.findAndCount(${modelName}, {
      skip,
      take,
      where: JSON.parse(JSON.stringify(search)),
      order: JSON.parse(JSON.stringify(order[0] || {})),
    }));

    return {
      items,
      total,
      hasMore: skip + take < total,
    };
  }

  @Query((returns) => [${modelName}])
  async ${plural(resourceName)}(@Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.find(${modelName}, getFindOptions(${modelName}, info)));
  }

  @Mutation((returns) => ${modelName})
  async create${modelName}(@Arg('input') input: ${modelName}CreateInput, @Ctx() ctx: IRequestContext): Promise<${modelName}> {
    const model = new ${modelName}();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => ${modelName})
  async update${modelName}(@Arg('input') input: ${modelName}EditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(${modelName}, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  async delete${plural(modelName)}(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(${modelName}, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
`);
}

import { lowerFirst } from 'lodash';
import { plural } from 'pluralize';
import { ISingleErModel } from './model-types';

export function generateCrudResolver(model: ISingleErModel) {
  const modelName = model.name;
  const resourceName = lowerFirst(modelName);

  return (
    `import { Arg, Args, Mutation, Query, Info, ID, Ctx, Resolver, Root, FieldResolver, Int } from 'type-graphql';
import cleanDeep from 'clean-deep';

import { ${modelName} } from '../models/${modelName}';
import { ${modelName}CreateInput } from '../inputs/${modelName}CreateInput';
import { ${modelName}EditInput } from '../inputs/${modelName}EditInput';
import { ${modelName}SearchInput } from '../inputs/${modelName}SearchInput';
import { ${modelName}SearchOrderInput } from '../inputs/${modelName}SearchOrderInput';
import { getFindOptions } from '../../shared/get-find-options';
import { EntityId, EntityIdScalar } from '../../shared/EntityId';
import { IRequestContext } from '../../shared/IRequestContext';
import * as auth from '../../authorization/auth-checkers';
import { PaginatedResponse } from '../../shared/PaginationResponse';
import { resolveGetters } from '../../shared/resolve-getters';

// <keep-imports>
// </keep-imports>

const Paginated${modelName}Response = PaginatedResponse(${modelName});

@Resolver(${modelName})
export class ${modelName}CrudResolver {
  @Query(() => ${modelName})
  async ${resourceName}(@Arg('id', () => EntityIdScalar) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return await ctx.em.findOneOrFail(${modelName}, id, getFindOptions(${modelName}, info));
  }

  @Query(() => Paginated${modelName}Response)
  public async search${plural(modelName)}(
    @Arg('search', () => ${modelName}SearchInput, { nullable: true }) search: ${modelName}SearchInput | null = null,
    @Arg('skip', () => Int, { nullable: true }) skip: number = 0,
    @Arg('take', () => Int, { nullable: true }) take: number = 25,
    @Arg('order', () => [${modelName}SearchOrderInput], { nullable: true }) order: Array<${modelName}SearchOrderInput> = [],
    @Info() info,
    @Ctx() ctx: IRequestContext,
  ) {
    const defaultFindOptions = getFindOptions(${modelName}, info, { transformQueryPath: x => x.replace(/^items./, '') });

    const [items, total] = await ctx.em.findAndCount(${modelName}, cleanDeep({
      ...defaultFindOptions,
      skip,
      take,
      where: resolveGetters(search),
      order: Object.assign({}, ...order),
    }));

    return {
      items,
      total,
      hasMore: skip + take < total,
    };
  }

  @Query(() => [${modelName}])
  async ${plural(resourceName)}(@Info() info, @Ctx() ctx: IRequestContext) {
    return await ctx.em.find(${modelName}, getFindOptions(${modelName}, info));
  }

  @Mutation(() => ${modelName})
  async create${modelName}(@Arg('input') input: ${modelName}CreateInput, @Ctx() ctx: IRequestContext): Promise<${modelName}> {
    const model = new ${modelName}();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => ${modelName})
  async update${modelName}(@Arg('input') input: ${modelName}EditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(${modelName}, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => Boolean)
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

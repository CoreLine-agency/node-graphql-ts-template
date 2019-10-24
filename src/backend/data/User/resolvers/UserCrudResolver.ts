/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
// tslint:disable max-line-length
import * as cleanDeep from 'clean-deep';
import { Arg, Args, Ctx, FieldResolver, ID, Info, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import * as auth from '../../../utils/auth/auth-checkers';
import { getFindOptions } from '../../../utils/get-find-options';
import { resolveGetters } from '../../../utils/resolve-getters';
import { EntityId, EntityIdScalar } from '../../EntityId';
import { IRequestContext } from '../../IRequestContext';
import { PaginatedResponse } from '../../PaginationResponse';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { UserSearchInput } from '../inputs/UserSearchInput';
import { UserSearchOrderInput } from '../inputs/UserSearchOrderInput';
import { User } from '../models/User';

// <keep-imports>
// </keep-imports>

const PaginatedUserResponse = PaginatedResponse(User);

@Resolver(User)
export class UserCrudResolver {
  @Query(() => User)
  public async user(@Arg('id', () => EntityIdScalar) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOneOrFail(User, id, getFindOptions(User, info));
  }

  @Query(() => PaginatedUserResponse)
  public async searchUsers(
    @Arg('search', () => UserSearchInput, { nullable: true }) search: UserSearchInput | null = null,
    @Arg('skip', () => Int, { nullable: true }) skip: number = 0,
    @Arg('take', () => Int, { nullable: true }) take: number = 25,
    @Arg('order', () => [UserSearchOrderInput], { nullable: true }) order: Array<UserSearchOrderInput> = [],
    @Info() info,
    @Ctx() ctx: IRequestContext,
  ) {
    const defaultFindOptions = getFindOptions(User, info, { transformQueryPath: x => x.replace(/^items./, '') });

    const [items, total] = await ctx.em.findAndCount(User, cleanDeep({
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

  @Query(() => [User])
  public async users(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(User, getFindOptions(User, info));
  }

  @Mutation(() => User)
  public async createUser(@Arg('input') input: UserCreateInput, @Ctx() ctx: IRequestContext): Promise<User> {
    const model = new User();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => User)
  public async updateUser(@Arg('input') input: UserEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(User, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => Boolean)
  public async deleteUsers(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(User, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}

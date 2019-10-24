/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
// tslint:disable max-line-length
import * as cleanDeep from 'clean-deep';
import { Arg, Args, Ctx, FieldResolver, ID, Info, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import * as auth from '../../authorization/auth-checkers';
import { EntityId, EntityIdScalar } from '../../shared/EntityId';
import { getFindOptions } from '../../shared/get-find-options';
import { IRequestContext } from '../../shared/IRequestContext';
import { PaginatedResponse } from '../../shared/PaginationResponse';
import { resolveGetters } from '../../shared/resolve-getters';
import { FileCreateInput } from '../inputs/FileCreateInput';
import { FileEditInput } from '../inputs/FileEditInput';
import { FileSearchInput } from '../inputs/FileSearchInput';
import { FileSearchOrderInput } from '../inputs/FileSearchOrderInput';
import { File } from '../models/File';

// <keep-imports>
// </keep-imports>

const PaginatedFileResponse = PaginatedResponse(File);

@Resolver(File)
export class FileCrudResolver {
  @Query(() => File)
  public async file(@Arg('id', () => EntityIdScalar) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOneOrFail(File, id, getFindOptions(File, info));
  }

  @Query(() => PaginatedFileResponse)
  public async searchFiles(
    @Arg('search', () => FileSearchInput, { nullable: true }) search: FileSearchInput | null = null,
    @Arg('skip', () => Int, { nullable: true }) skip: number = 0,
    @Arg('take', () => Int, { nullable: true }) take: number = 25,
    @Arg('order', () => [FileSearchOrderInput], { nullable: true }) order: Array<FileSearchOrderInput> = [],
    @Info() info,
    @Ctx() ctx: IRequestContext,
  ) {
    const defaultFindOptions = getFindOptions(File, info, { transformQueryPath: x => x.replace(/^items./, '') });

    const [items, total] = await ctx.em.findAndCount(File, cleanDeep({
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

  @Query(() => [File])
  public async files(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(File, getFindOptions(File, info));
  }

  @Mutation(() => File)
  public async createFile(@Arg('input') input: FileCreateInput, @Ctx() ctx: IRequestContext): Promise<File> {
    const model = new File();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => File)
  public async updateFile(@Arg('input') input: FileEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(File, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation(() => Boolean)
  public async deleteFiles(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(File, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
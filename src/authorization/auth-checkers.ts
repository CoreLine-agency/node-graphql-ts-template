import bluebird from 'bluebird';
import { UnauthorizedError } from 'type-graphql';

import { IRequestContext } from '../shared/IRequestContext';
import { IAuthorizable } from './IAuthorizable';

export async function canRead(
  entity: IAuthorizable | null | undefined,
  ctx: IRequestContext,
  fieldName?: string,
) {
  if (!entity) {
    return true;
  }

  if (!entity.authorizationChecker) {
    return true;
  }

  return entity.authorizationChecker.canRead(ctx, fieldName);
}

export async function assertCanRead<T extends IAuthorizable>(
  entity: IAuthorizable | null | undefined,
  ctx: IRequestContext,
  fieldName?: string) {
  if (!await canRead(entity, ctx, fieldName)) {
    throw new UnauthorizedError();
  }

  return entity;
}

export async function assertCanPersist<T extends IAuthorizable>(entity: T, ctx: IRequestContext): Promise<T> {
  if (!entity.authorizationChecker) {
    return entity;
  }

  if (!await entity.authorizationChecker.canPersist(ctx)) {
    throw new UnauthorizedError();
  }

  return entity;
}

export async function assertCanUpdate<T extends IAuthorizable>(entity: T, ctx: IRequestContext): Promise<T> {
  if (!entity.authorizationChecker) {
    return entity;
  }

  if (!await entity.authorizationChecker.canUpdate(ctx)) {
    console.error('Cannot update!');
    throw new UnauthorizedError();
  }

  return entity;
}

export async function assertCanDelete<T extends IAuthorizable>(entity: T | Array<T>, ctx: IRequestContext): Promise<T | Array<T>> {
  if (entity instanceof Array) {
    await bluebird.map(entity, (e) => assertCanDelete(e, ctx));

    return entity;
  }

  if (!entity.authorizationChecker) {
    return entity;
  }

  if (!await entity.authorizationChecker.canDelete(ctx)) {
    throw new UnauthorizedError();
  }

  return entity;
}

import { first, flatten, tail, uniq } from 'lodash';
import { EntityMetadata, getRepository } from 'typeorm';

const getFieldNames = require('graphql-list-fields');

function expandPath(path: string) {
  const pathCopy = [...path.split('.')];

  const expanded: Array<string> = [];
  do {
    expanded.push(pathCopy.join('.'));
  } while (pathCopy.pop());

  return expanded;
}

function getPaths(fields: Array<string>) {
  const paths = fields
    .map((name) => {
      const path = name.split('.');
      path.pop();

      return path;
    })
    .filter((path) => path.length)
    .map((path) => path.join('.'))
    .map(expandPath);

  return uniq(flatten(paths));
}

function isPathRelation(path: Array<string>, meta: EntityMetadata) {
  if (path.length === 0) {
    return true;
  }

  const potentialRelation = first(path);
  const relation = meta.relations.filter((r) => r.propertyName === potentialRelation)[0];
  if (!relation) {
    return false;
  }

  return isPathRelation(tail(path), relation.inverseEntityMetadata);
}

export function getRelations(EntityType, queryInfo, opts: IGetFindOptionsOpts): Array<string> {
  const { metadata } = getRepository(EntityType);
  const paths = getPaths(getFieldNames(queryInfo).map(opts.transformQueryPath));

  return paths.filter((path) => isPathRelation(path.split('.'), metadata));
}

export interface IGetFindOptionsOpts {
  transformQueryPath(path: string): string;
}

const getFindOptionsOptsDefault: IGetFindOptionsOpts = {
  transformQueryPath: x => x,
};

export function getFindOptions(EntityType, info, opts = getFindOptionsOptsDefault): any {
  const relations = getRelations(EntityType, info, opts);

  return {
    order: {
      id: 'ASC',
    },
    relations,
  };
}

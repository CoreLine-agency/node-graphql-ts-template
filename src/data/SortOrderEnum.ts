import { registerEnumType } from 'type-graphql';

export enum SortOrderEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

registerEnumType(SortOrderEnum, { name: 'OrderEnum' });

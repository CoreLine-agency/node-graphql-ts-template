import { includes, upperFirst } from 'lodash';

export interface IFieldDefinition {
  name: string;
  type: string;
  visibility: string;
  dbType: string | undefined;
  optional: boolean;
  modelName: string;
  notNullable?: boolean;
  otherModelType?: string;
}

export interface IModelDefinition {
  name: string;
  fields: Array<IFieldDefinition>;
}

export interface ISingleErRelation {
  otherTypeName: string;
  otherName: string;
  myTypeName: string;
  myName: string;
  relationType: string;
  otherRelationType: string;
  optional: boolean;
  isFirst: boolean;
  autoAssignKey?: string;
}

export interface ISingleErModel {
  name: string;
  fields: Array<IFieldDefinition>;
  relations: Array<ISingleErRelation>;
}

export interface IRelationComponent {
  source: string;
  target: string;
  as: string;
  type: string;
  optional: boolean;
  autoAssignKey?: string;
}

export function isEnum(field: IFieldDefinition) {
  return includes(field.type, '|');
}

export function getEnumValues(field: IFieldDefinition) {
  return field.type.trim().split('|').map((x) => x.trim());
}

export function getEnumName(field: IFieldDefinition) {
  return `${field.modelName}${upperFirst(field.name)}`;
}

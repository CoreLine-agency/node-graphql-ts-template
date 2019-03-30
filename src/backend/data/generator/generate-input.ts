import { uniq, upperFirst } from 'lodash';
import { generateEnumsImports, generateFieldDeco, getFieldName, getTsTypeName } from './generate-base';
import { IFieldDefinition, ISingleErModel, ISingleErRelation } from './model-types';

function getImportPath(type: string) {
  if (type === 'SortOrderEnum') {
    return `../SortOrderEnum`;
  }

  return `./${type}`;
}
export function generateNestedInputsImports(fields: Array<IFieldDefinition>) {
  return fields
    .map((field) => `import { ${field.type} } from '${getImportPath(field.type)}'`);
}

export function generateField(field: IFieldDefinition) {
  return (
`  ${generateFieldDeco(field)}
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
}

export function makeOptional(field: IFieldDefinition): IFieldDefinition {
  return {
    ...field,
    optional: true,
  };
}

export function makeSortOrderEnumType(field: IFieldDefinition): IFieldDefinition {
  return {
    ...field,
    type: 'SortOrderEnum',
  };
}

export function generateInput(model: ISingleErModel, type: 'edit' | 'create' | 'nested' | 'search' | 'searchOrder') {
  const name = model.name;

  const transformToOptional = type === 'create' ? (x) => x : makeOptional;
  const transformToSearchOrder = type === 'searchOrder' ? makeSortOrderEnumType : (x) => x;

  const getOtherType = (r: ISingleErRelation) => {
    if (type === 'search') {
      return 'ReferenceSearchInput';
    }
    if (type === 'searchOrder') {
      return 'SortOrderEnum';
    }

    return `${r.otherTypeName}NestedInput`;
  };

  const inputFields = model
    .fields
    .filter((f) => f.visibility !== '+')
    .map(transformToOptional)
    .map(transformToSearchOrder);

  const relations = model.relations.filter(r => !r.autoAssignKey || ['search', 'searchOrder'].includes(type));

  const manyToOneRelations = relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'many');
  const manyToOneFields = manyToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: r.myName,
    optional: r.optional,
    type: getOtherType(r),
    visibility: '',
    modelName: name,
  })).map(transformToOptional);

  const oneToOneRelations = relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one');
  const oneToOneFields = oneToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: r.myName,
    optional: r.optional || r.isFirst,
    type: getOtherType(r),
    visibility: '',
    modelName: name,
  })).map(transformToOptional);

  const idFields: Array<IFieldDefinition> = [];
  if (type !== 'create') {
    idFields.push({
      dbType: undefined,
      name: 'id',
      optional: type !== 'edit',
      type: type === 'searchOrder' ? 'SortOrderEnum' : 'EntityId',
      visibility: '',
      modelName: name,
      notNullable: type !== 'edit',
    });
  }

  const allInputFields = [...idFields, ...inputFields, ...manyToOneFields, ...oneToOneFields];

  return (
`import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';
${generateEnumsImports(model.fields)}
${uniq([
  type === 'searchOrder' ? "import { SortOrderEnum } from '../SortOrderEnum'" : '',
  ...generateNestedInputsImports(manyToOneFields),
  ...generateNestedInputsImports(oneToOneFields),
]).filter(x => x).join('\n')}

// <keep-imports>
// </keep-imports>

@InputType()
export class ${name}${upperFirst(type)}Input {
${allInputFields.map(generateField).join('\n\n')}

  // <keep-methods>
  // </keep-methods>
}
`);
}

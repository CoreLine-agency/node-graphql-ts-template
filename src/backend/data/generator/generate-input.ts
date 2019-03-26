import { upperFirst } from 'lodash';
import { generateEnumsImports, generateFieldDeco, getFieldName, getTsTypeName } from './generate-base';
import { IFieldDefinition, ISingleErModel, ISingleErRelation } from './model-types';

export function generateNestedInputsImports(fields: Array<IFieldDefinition>) {
  return fields.map((field) => `import { ${field.type} } from './${field.type}'`).join('\n');
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

export function generateInput(model: ISingleErModel, type: 'edit' | 'create' | 'nested') {
  const name = model.name;

  const transform = type === 'edit' || type === 'nested' ? makeOptional : (x) => x;

  const inputFields = model.fields.filter((f) => f.visibility !== '+').map(transform);
  const relations = model.relations.filter(r => !r.autoAssignKey);

  const manyToOneRelations = relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'many');
  const manyToOneFields = manyToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: r.myName,
    optional: r.optional,
    type: `${r.otherTypeName}NestedInput`,
    visibility: '',
    modelName: name,
  })).map(transform);

  const oneToOneRelations = relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one');
  const oneToOneFields = oneToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: r.myName,
    optional: r.optional || r.isFirst,
    type: `${r.otherTypeName}NestedInput`,
    visibility: '',
    modelName: name,
  })).map(transform);

  const idFields: Array<IFieldDefinition> = [];
  if (type === 'edit' || type === 'nested') {
    idFields.push({
      dbType: undefined,
      name: `id`,
      optional: type === 'nested',
      type: 'EntityId',
      visibility: '',
      modelName: name,
      notNullable: type === 'nested',
    });
  }

  const allInputFields = [...idFields, ...inputFields, ...manyToOneFields, ...oneToOneFields];

  return (
`import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';
${generateEnumsImports(model.fields)}
${generateNestedInputsImports(manyToOneFields)}
${generateNestedInputsImports(oneToOneFields)}

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

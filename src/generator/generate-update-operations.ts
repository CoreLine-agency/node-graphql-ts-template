import { lowerFirst, uniq, upperFirst, kebabCase } from 'lodash';
import { ISingleErModel, ISingleErRelation } from './model-types';

function getFieldName(relation: ISingleErRelation) {
  return relation.myName;
}

export function generateToOneInitialization(relation: ISingleErRelation, modelName: string) {
  const fieldName = getFieldName(relation);
  const modelVariableName = lowerFirst(modelName);
  const existingRelationName = `existing${upperFirst(relation.myName)}`;

  return (
    `export async function update${upperFirst(relation.myName)}Relation(${modelVariableName}: ${modelName}, ${fieldName}: ${relation.otherTypeName}NestedInput | null | undefined, context: IRequestContext) {
  const ${existingRelationName} = await ${modelVariableName}.${relation.myName};

  if (${fieldName} === null) {
    ${relation.optional ? `${modelVariableName}.${relation.myName} = Promise.resolve(null);` : `throw new Error('${relation.myTypeName}.${relation.myName} cannot be null')`}
  } else if (${fieldName} === undefined) {
    // do nothing
  } else if (${fieldName}.id) {
    const ${fieldName}Model = await context.em.findOneOrFail(${relation.otherTypeName}, ${fieldName}.id);
    ${modelVariableName}.${relation.myName} = asPromise(await ${fieldName}Model.update(${fieldName}, context));
  } else if (${existingRelationName}) {
    await ${existingRelationName}.update(${fieldName}, context);
  } else {
    ${modelVariableName}.${relation.myName} = asPromise(await new ${relation.otherTypeName}().update(${fieldName}, context));
  }
}
`);
}

function generateNestedInputImport(name: string) {
  return `import { ${name}NestedInput } from '../../../${kebabCase(name)}/inputs/${name}NestedInput';`;
}

function generateModelImport(name: string) {
  return `import { ${name} } from '../../../${kebabCase(name)}/models/${name}';`;
}

export function generateUpdateOperations(model: ISingleErModel) {
  const toOneRelations = model.relations.filter((r) => r.relationType === 'one').filter(r => !r.autoAssignKey);

  return (
    `import { asPromise } from '../../../shared/as-promise';
import { IRequestContext } from '../../../shared/IRequestContext';
${generateModelImport(model.name)};
${uniq(toOneRelations.map((r) => generateNestedInputImport(r.otherTypeName))).join('\n')}
${uniq(toOneRelations.filter(r => r.otherTypeName !== model.name).map((r) => generateModelImport(r.otherTypeName))).join('\n')}

${toOneRelations.map((r) => generateToOneInitialization(r, model.name)).join('\n')}
`);
}

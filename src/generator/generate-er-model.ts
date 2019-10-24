/* eslint-disable @typescript-eslint/no-use-before-define */
import { kebabCase, lowerFirst, sortedUniq, upperFirst } from 'lodash';

import { generateEnumsImports, generateField } from './generate-base';
import { IGeneratorContext } from './generator-context';
import { asLastArgument, stringifyClean } from './helpers/stringify-clean';
import { ISingleErModel, ISingleErRelation } from './model-types';

export function generateTypeImport(type: string) {
  return `import { ${type} } from '../../${kebabCase(type)}/models/${type}';`;
}

export function generateOneToOneOwnerDeclarations(relations: Array<ISingleErRelation>) {
  const nullableRelations: Array<ISingleErRelation> = relations.map((r) => ({ ...r, optional: true }));

  return nullableRelations.map((r) =>
    `  @OneToOne(() => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field(() => ${r.otherTypeName} ${generateFieldArgs(r)})
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;
`);
}

export function generateOneToOneSecondaryDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) => {
    return (
      `  @OneToOne(() => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName} ${generateRelationArgs(r)})
  @Field(() => ${r.otherTypeName} ${generateFieldArgs(r)})
  @JoinColumn()
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;
`); }).join('\n\n');
}

export function generateOneToManyDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
    `  @OneToMany(() => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field(() => [${r.otherTypeName}])
  public ${r.myName}: Promise<Array<${r.otherTypeName}>>;`).join('\n\n');
}

export function generateRelationArgs(relation: ISingleErRelation) {
  const relationsArgs = stringifyClean({
    nullable: relation.optional,
    onDelete: relation.optional ? 'SET NULL' : 'CASCADE',
  });

  return asLastArgument(relationsArgs);
}

export function generateFieldArgs(relation: ISingleErRelation) {
  const relationsArgs = stringifyClean({
    nullable: relation.optional,
  });

  return asLastArgument(relationsArgs);
}

export function getRelationName(r: ISingleErRelation) {
  return r.myName;
}

export function getRelationOtherTypeName(r: ISingleErRelation) {
  if (r.optional) {
    return `${r.otherTypeName} | undefined | null`;
  } else {
    return r.otherTypeName;
  }
}

export function generateManyToOneDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
    `  @ManyToOne(() => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName} ${generateRelationArgs(r)})
  @Field(() => ${r.otherTypeName} ${generateFieldArgs(r)})
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;`).join('\n\n');
}

export function generateTypesImports(types: Array<string>) {
  return types.map(generateTypeImport).join('\n');
}

function getFieldName(relation: ISingleErRelation) {
  return relation.myName;
}

function generateRelationUpdateCall(relation: ISingleErRelation) {
  const fieldName = getFieldName(relation);

  return `  await update${upperFirst(relation.myName)}Relation(this, ${fieldName}, context);`;
}

function generateContextUpdateCall(relation: ISingleErRelation) {
  const fieldName = getFieldName(relation);

  return `this.${fieldName} = asPromise(await this.${fieldName} || await ${relation.autoAssignKey})`;
}

function generateRelationUpdateImports(modelName: string, relations: Array<ISingleErRelation>) {
  const destructureStatement = relations
    .filter(r => !r.autoAssignKey)
    .map((r) => `update${upperFirst(r.myName)}Relation`)
    .join(',');

  return `import { ${destructureStatement} } from './update-operations/${lowerFirst(modelName)}-update-operations';`;
}

export function generateDestructureStatement(relations: Array<ISingleErRelation>) {
  const destructureStatement = relations.map(getFieldName);
  if (destructureStatement.length === 0) {
    return `const data = input`;
  } else {
    return `const { ${destructureStatement.join(', ')}, ...data } = input;`;
  }
}

function notAutoAssign(relation: ISingleErRelation) {
  return !relation.autoAssignKey;
}

export function generateSingleModel(model: ISingleErModel, ctx: IGeneratorContext) {
  const name = model.name;
  const autoAssignRelations = model.relations.filter(r => r.autoAssignKey);

  let generatedAutoAssignRelations = '';
  if (autoAssignRelations.length) {
    generatedAutoAssignRelations =
`if (getInputOperationType(this, input) === 'create') {
      ${autoAssignRelations.map(generateContextUpdateCall).join('\n')}
    }`;
  }

  const types = sortedUniq(model.relations.map((r) => r.otherTypeName));

  const oneToManyRelations = model.relations.filter((r) => r.relationType === 'many' && r.otherRelationType === 'one');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'many');
  const oneToOneOwnerRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one' && r.isFirst);
  const oneToOneSecondaryRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one' && !r.isFirst);

  const dbFields = model.fields.filter((f) => f.visibility === '+' || f.visibility === '-');

  return (
    `import { Field, ID, ObjectType } from 'type-graphql';
import { Column, JoinColumn, Entity, OneToOne, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

${generateTypesImports(types.filter(type => type !== model.name))}
${generateEnumsImports(model.fields)}
import * as auth from '../../authorization/auth-checkers';
import { ${name}CreateInput } from '../inputs/${name}CreateInput';
import { ${name}EditInput } from '../inputs/${name}EditInput';
import { ${name}NestedInput } from '../inputs/${name}NestedInput';
import { IRequestContext } from '../../shared/IRequestContext';
import { IAuthorizable } from '../../authorization/IAuthorizable';
import { EntityId, EntityIdScalar } from '../../shared/EntityId';
import { ${name}Auth } from '../auth/${name}Auth';
import { getInputOperationType } from '../../shared/get-input-operation-type';
import { noChange } from '../../shared/no-change';
import { asPromise } from '../../shared/as-promise';

${generateRelationUpdateImports(model.name, model.relations.filter((r) => r.relationType === 'one'))}

// <keep-imports>
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class ${name} implements IAuthorizable {
  @Field(() => EntityIdScalar)
  @PrimaryGeneratedColumn()
  id: EntityId;

  public authorizationChecker = new ${name}Auth(this);

${dbFields.map(generateField(ctx)).join('\n\n')}

${generateManyToOneDeclarations(manyToOneRelations)}

${generateOneToManyDeclarations(oneToManyRelations)}


${generateOneToOneOwnerDeclarations(oneToOneOwnerRelations)}
${generateOneToOneSecondaryDeclarations(oneToOneSecondaryRelations)}

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  public async update(input: ${name}CreateInput | ${name}EditInput | ${name}NestedInput, context: IRequestContext) {
    ${generateDestructureStatement([...manyToOneRelations, ...oneToOneOwnerRelations, ...oneToOneSecondaryRelations].filter(notAutoAssign))}
    if (noChange(input)) {
      return this;
    }
    if (getInputOperationType(this, input) === 'update') {
      await auth.assertCanUpdate(this, context);
    }
    Object.assign(this, data);

${generatedAutoAssignRelations}
${manyToOneRelations.filter(notAutoAssign).map(generateRelationUpdateCall).join('\n')}
${oneToOneOwnerRelations.filter(notAutoAssign).map(generateRelationUpdateCall).join('\n')}
${oneToOneSecondaryRelations.filter(notAutoAssign).map(generateRelationUpdateCall).join('\n')}

    context.modelsToSave.push(this);

    // <keep-update-code>
    // </keep-update-code>
    await auth.assertCanPersist(this, context);

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
`);
}

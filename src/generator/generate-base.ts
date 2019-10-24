import { upperFirst } from 'lodash';
import { IGeneratorContext } from './generator-context';
import { findBetween, findBetweenReversed } from './helpers/find-between';
import { stringifyClean } from './helpers/stringify-clean';
import { getEnumName, IFieldDefinition, isEnum } from './model-types';

export function generateFieldDeco(field: IFieldDefinition) {
  if (field.visibility === '+') {
    return '';
  }

  const columnArgs = stringifyClean({
    nullable: field.optional || undefined,
  });

  const type
    = field.type === 'EntityId' ? 'EntityIdScalar'
      : isEnum(field)             ? getEnumName(field)
        : upperFirst(field.type);

  return `@Field(() => ${type}, ${columnArgs})`;
}

export function getTsTypeName(field: IFieldDefinition) {
  const type = isEnum(field) ? getEnumName(field) : field.type;

  if (field.optional && !field.notNullable) {
    return `${type} | null`;
  }

  return type;
}

export function getFieldName(field: IFieldDefinition) {
  if (field.optional) {
    return `${field.name}?`;
  }

  return field.name;
}

export function generateEnumsImports(fields: Array<IFieldDefinition>) {
  return fields
    .filter(isEnum)
    .map((field) => `import { ${getEnumName(field)} } from '../enums/${getEnumName(field)}';`)
    .join('\n');
}

export const generateField = (ctx: IGeneratorContext) => (field: IFieldDefinition) => {
  const customColumnArgsContentPart = findBetweenReversed(ctx.existingContent, '@Column', `public ${field.name}`);
  const customColumnData = (customColumnArgsContentPart && findBetween(
    customColumnArgsContentPart,
    '// <custom-column-args>',
    '// </custom-column-args>',
  ) || '').trim();

  const columnArgsDefault = stringifyClean({
    nullable: field.optional || undefined,
    type: field.dbType,
    enum: isEnum(field) ? getEnumName(field) : undefined,
  },
  ['enum'],
  );

  const columnArgsFromCode = customColumnData ? `
    // <custom-column-args>
    ${customColumnData}
    // </custom-column-args>
` : `
    // <custom-column-args>
    // </custom-column-args>
`;

  const columnArgs = columnArgsDefault ?
    columnArgsDefault.replace(/}$/, `,${columnArgsFromCode}  }`) :
    `{${columnArgsFromCode}  }`;

  return (
    `  ${generateFieldDeco(field)}
  @Column(${columnArgs})
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
};

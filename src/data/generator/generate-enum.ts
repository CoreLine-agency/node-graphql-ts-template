import { getEnumName, IFieldDefinition, ISingleErModel } from './model-types';

function generateEnumValue(enumValue) {
  return `${enumValue} = '${enumValue}'`;
}

export function generateEnum(model: ISingleErModel, field: IFieldDefinition) {
  return (
`import { registerEnumType } from 'type-graphql';

export enum ${getEnumName(field)} {
${field.type.split('|').map(generateEnumValue).map((x) => `  ${x}`).join(',\n')}
}

registerEnumType(${getEnumName(field)}, {
  name: '${getEnumName(field)}',
});
`);
}

export function getInputOperationType(model, input): 'create' | 'update' | 'assign' {
  if (model.id && 'id' in input && Object.keys(input).length > 1) {
    return 'update';
  }

  if (!('id' in input)) {
    return 'create';
  }

  return 'assign';
}

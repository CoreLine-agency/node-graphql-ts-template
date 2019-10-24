export function noChange(inputData: any) {
  const keys = Object.keys(inputData);
  if (keys.length === 0) {
    return true;
  }

  return keys.length === 1 && keys[0] === 'id';
}

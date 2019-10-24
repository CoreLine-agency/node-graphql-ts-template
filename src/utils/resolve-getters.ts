export function resolveGetters<T>(input: T): T {
  if (!input) {
    return input;
  }

  const result = {};

  const keys = [...Object.keys(Object.getPrototypeOf(input)), ...Object.keys(input)];

  for (const key of keys) {
    if (typeof input[key] !== 'function') {
      result[key] = input[key];
    }
  }

  if (typeof input['getAdditionalOptions'] === 'function') {
    Object.assign(result, input['getAdditionalOptions']());
  }

  return result as T;
}

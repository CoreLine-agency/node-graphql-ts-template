export function asPromise<T>(x: T): Promise<T> {
  return x as any;
}

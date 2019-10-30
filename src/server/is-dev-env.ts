import env from 'env-var';

const NODE_ENV = env.get('NODE_ENV', 'development').asString();

export function isDevEnv() {
  return NODE_ENV === 'development';
}

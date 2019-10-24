import { formatError as defaultFormatError } from 'graphql';
import { captureException, setContext } from 'raven';
import { IRequestContext } from '../data/IRequestContext';

export function formatError(error) {
  const result = defaultFormatError(error);
  const originalError = error && error.originalError;
  if (originalError && originalError.isValidationError) {
    Object.assign(result, originalError);
  }

  return result;
}

export async function ravenMiddleware(resolve, root, args, context: IRequestContext, info) {
  try {
    return await resolve(root, args, context, info);
  } catch (e) {
    if (!e.isValidationError) {
      const { request } = context;
      let user: string | object = 'Not logged in';
      if (context.auth) {
        user = context.auth.user;
      }
      setContext({
        request,
        user,
      });
      captureException(e);
    }
    throw e;
  }
}

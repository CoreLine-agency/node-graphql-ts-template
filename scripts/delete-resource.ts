import * as fs from 'fs';
import * as path from 'path';
import { lowerFirst } from 'lodash';

const name = process.argv[2];
if (!name) {
  throw new Error('Missing resource name');
}

try { fs.unlinkSync(path.join('src/backend/data/models', `${name}.ts`)); } catch { /* ignore */ }
try {
  fs.unlinkSync(path.join('src/backend/data/models/update-operations', `${lowerFirst(name)}-update-operations.ts`));
} catch {
  /* ignore */
}
try { fs.unlinkSync(path.join('src/backend/data/auth', `${name}Auth.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/field-resolvers', `${name}Resolver.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/inputs', `${name}CreateInput.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/inputs', `${name}EditInput.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/inputs', `${name}NestedInput.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/inputs', `${name}SearchInput.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/inputs', `${name}FileSearchOrderInput.ts`)); } catch { /* ignore */ }
try { fs.unlinkSync(path.join('src/backend/data/resolvers', `${name}CrudResolver.ts`)); } catch { /* ignore */ }

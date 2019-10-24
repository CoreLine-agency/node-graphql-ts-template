import { FieldResolver, Resolver, Root } from 'type-graphql';

import config from '../../server/config';
import { File } from '../models/File';

@Resolver(File)
export class FileResolver {
  @FieldResolver(() => String)
  public async url(@Root() file: File) {
    return `${config.serverUrl}/files/${file.slug}`;
  }

  @FieldResolver(() => String)
  public async thumbUrl(@Root() file: File) {
    return `${config.serverUrl}/files/${file.slug}?thumb=true`;
  }
}

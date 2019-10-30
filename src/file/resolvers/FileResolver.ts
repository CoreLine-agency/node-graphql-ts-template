import { FieldResolver, Resolver, Root } from 'type-graphql';
import env from 'env-var';

import { File } from '../models/File';

const SERVER_URL = env.get('SERVER_URL').required().asString();

@Resolver(File)
export class FileResolver {
  @FieldResolver(() => String)
  public async url(@Root() file: File) {
    return `${SERVER_URL}/files/${file.slug}`;
  }

  @FieldResolver(() => String)
  public async thumbUrl(@Root() file: File) {
    return `${SERVER_URL}/files/${file.slug}?thumb=true`;
  }
}

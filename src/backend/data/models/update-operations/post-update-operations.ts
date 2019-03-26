/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
// tslint:disable max-line-length
import { asPromise } from '../../../utils/as-promise';
import { UserNestedInput } from '../../inputs/UserNestedInput';
import { IRequestContext } from '../../IRequestContext';
import { Post } from '../Post';
import { User } from '../User';

export async function updateAuthorRelation(post: Post, author: UserNestedInput | null | undefined, context: IRequestContext) {
  if (author === null) {
    throw new Error('Post.author cannot be null');
  } else if (author === undefined) {
    // do nothing
  } else if (author.id) {
    const authorModel = await context.em.findOneOrFail(User, author.id);
    post.author = asPromise(await authorModel.update(author, context));
  } else {
    post.author = asPromise(await new User().update(author, context));
  }
}

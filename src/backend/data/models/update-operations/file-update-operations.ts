/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
// tslint:disable max-line-length
import { asPromise } from '../../../utils/as-promise';
import { PostNestedInput } from '../../inputs/PostNestedInput';
import { UserNestedInput } from '../../inputs/UserNestedInput';
import { IRequestContext } from '../../IRequestContext';
import { File } from '../File';
import { Post } from '../Post';
import { User } from '../User';

export async function updateUserRelation(file: File, user: UserNestedInput | null | undefined, context: IRequestContext) {
  if (user === null) {
    file.user = Promise.resolve(null);
  } else if (user === undefined) {
    // do nothing
  } else if (user.id) {
    const userModel = await context.em.findOneOrFail(User, user.id);
    file.user = asPromise(await userModel.update(user, context));
  } else {
    file.user = asPromise(await new User().update(user, context));
  }
}

export async function updatePostRelation(file: File, post: PostNestedInput | null | undefined, context: IRequestContext) {
  if (post === null) {
    file.post = Promise.resolve(null);
  } else if (post === undefined) {
    // do nothing
  } else if (post.id) {
    const postModel = await context.em.findOneOrFail(Post, post.id);
    file.post = asPromise(await postModel.update(post, context));
  } else {
    file.post = asPromise(await new Post().update(post, context));
  }
}

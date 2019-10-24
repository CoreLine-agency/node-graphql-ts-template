/* eslint-disable @typescript-eslint/no-unused-vars */
/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { asPromise } from '../../../shared/as-promise';
import { IRequestContext } from '../../../shared/IRequestContext';
import { File } from '../../../file/models/File';
import { UserNestedInput } from '../../../user/inputs/UserNestedInput';
import { PostNestedInput } from '../../../post/inputs/PostNestedInput';
import { User } from '../../../user/models/User';
import { Post } from '../../../post/models/Post';

export async function updateUserRelation(file: File, user: UserNestedInput | null | undefined, context: IRequestContext) {
  const existingUser = await file.user;

  if (user === null) {
    file.user = Promise.resolve(null);
  } else if (user === undefined) {
    // do nothing
  } else if (user.id) {
    const userModel = await context.em.findOneOrFail(User, user.id);
    file.user = asPromise(await userModel.update(user, context));
  } else if (existingUser) {
    await existingUser.update(user, context);
  } else {
    file.user = asPromise(await new User().update(user, context));
  }
}

export async function updatePostRelation(file: File, post: PostNestedInput | null | undefined, context: IRequestContext) {
  const existingPost = await file.post;

  if (post === null) {
    file.post = Promise.resolve(null);
  } else if (post === undefined) {
    // do nothing
  } else if (post.id) {
    const postModel = await context.em.findOneOrFail(Post, post.id);
    file.post = asPromise(await postModel.update(post, context));
  } else if (existingPost) {
    await existingPost.update(post, context);
  } else {
    file.post = asPromise(await new Post().update(post, context));
  }
}


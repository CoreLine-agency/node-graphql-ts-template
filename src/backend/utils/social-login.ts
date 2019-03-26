import { IRequestContext } from '../data/IRequestContext';
import { User } from '../data/models/User';
import { signUserToken } from './crypto';

type LoginType = 'facebook' | 'google';

interface ISocialLoginData {
  firstName: string;
  lastName: string;
  email: string;
  socialId: string;
  loginType: LoginType;
}

export async function socialLogin(data: ISocialLoginData, foundUser: User | undefined, ctx: IRequestContext) {
  const { firstName, lastName, email, socialId, loginType } = data;
  if (foundUser) {
    const existingUserToken = signUserToken(foundUser);
    ctx.response!.cookie('token', existingUserToken);

    return existingUserToken;
  }

  const newUser = new User();
  await newUser.update({
    firstName,
    lastName,
    email,
  }, ctx);
  newUser.facebookUserId = loginType === 'facebook' ? socialId : undefined;
  newUser.googleUserId = loginType === 'google' ? socialId : undefined;
  await ctx.em.save(newUser);
  const token = signUserToken(newUser);
  ctx.response!.cookie('token', token);

  return token;
}

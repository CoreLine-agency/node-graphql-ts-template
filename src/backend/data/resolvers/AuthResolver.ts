import axios from 'axios';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { ValidationError } from '../../server/validation-error';
import {
  signUserToken,
} from '../../utils/crypto';
import { socialLogin } from '../../utils/social-login';
import { IFacebookApiResponse } from '../custom-types/IFacebookApiResponse';
import { IGoogleApiResponse } from '../custom-types/IGoogleApiResponse';
import { LoginResponse } from '../custom-types/LoginResponse';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

@Resolver()
export class AuthResolver {
  @Mutation((returns) => LoginResponse)
  public async emailRegister(
    @Arg('input') input: UserCreateInput,
    @Ctx() ctx: IRequestContext,
  ): Promise<LoginResponse> {
    const { firstName, lastName, email, password } = input;

    const foundUser = await ctx.em.findOne(User, { email });
    if (foundUser) {
      throw new ValidationError('User already exists', {
        email: 'User already exists',
      }, 400);
    }

    const user = new User();
    await user.update({
      firstName,
      lastName,
      email,
      password,
    }, ctx);

    await ctx.em.save(user);

    const token = signUserToken(user);
    ctx.response!.cookie('token', token);

    return new LoginResponse(token, user);
  }

  @Mutation((returns) => LoginResponse)
  public async emailLogin(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<LoginResponse> {
    const user = await ctx.em.findOne(User, {
      email,
    });
    if (!user) {
      throw new ValidationError('Invalid email or password', {
        email: 'Invalid email or password',
        password: 'Invalid email or password',
      }, 400);
    }

    if (!await user.passwordMatches(password)) {
      throw new ValidationError('Invalid email or password', {
        email: 'Invalid email or password',
        password: 'Invalid email or password',
      }, 400);
    }
    const token = signUserToken(user);
    ctx.response!.cookie('token', token);

    return new LoginResponse(token, user);
  }

  @Mutation((returns) => Boolean)
  public async logout(
    @Ctx() ctx: IRequestContext,
  ): Promise<boolean> {
    if (ctx.request!.cookies.token) {
      ctx.response!.clearCookie('token');
    }

    return true;
  }

  @Mutation((returns) => String)
  public async facebookLogin(
    @Arg('facebookAccessToken') facebookAccessToken: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<string> {
    let response: IFacebookApiResponse;
    try {
      response = await axios.get(
        `https://graph.facebook.com/me?access_token=${facebookAccessToken}&fields=id,first_name,last_name,email`);
    } catch (e) {
      throw new ValidationError('Facebook access token is invalid', {
        facebookAccessToken: 'Facebook access token is invalid',
      }, 400);
    }
    const { first_name: firstName, last_name: lastName, email, id: facebookUserId } = response.data;

    const foundUser = await ctx.em.findOne(User, {
      where: { facebookUserId: facebookUserId.toString() },
    });

    return socialLogin({
      email,
      firstName,
      lastName,
      socialId: facebookUserId.toString(),
      loginType: 'facebook',
    }, foundUser, ctx);
  }

  @Mutation((returns) => String)
  public async googleLogin(
    @Arg('googleAccessToken') googleAccessToken: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<string> {
    let response: IGoogleApiResponse;
    try {
      response = await axios.get(`
       https://www.googleapis.com/userinfo/v2/me?fields=email%2Cfamily_name%2Cgiven_name%2Cid&key=${googleAccessToken}`,
      );
    } catch (e) {
      throw new ValidationError('Google access token is invalid', {
        googleAccessToken: 'Google access token is invalid',
      }, 400);
    }
    const { id: googleUserId, email, given_name: firstName, family_name: lastName } = response.data;

    const foundUser = await ctx.em.findOne(User, {
      where: { googleUserId },
    });

    return socialLogin({
      email,
      firstName,
      lastName,
      socialId: googleUserId,
      loginType: 'google',
    }, foundUser, ctx);
  }
}

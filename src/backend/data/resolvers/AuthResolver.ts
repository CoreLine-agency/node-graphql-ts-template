import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { ValidationError } from '../../server/validation-error';
import {
  signUserToken,
} from '../../utils/crypto';
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
}

import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';

import { ServerError } from '../../server/server-error';
import { ValidationError } from '../../server/validation-error';
import { generateCode, hashPassword, signUserToken } from '../../utils/crypto';
import { LoginResponse } from '../custom-types/LoginResponse';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

@Resolver()
export class RecoveryResolver {
  @Mutation((returns) => Boolean)
  public async forgotPassword(
    @Arg('email') email: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<boolean> {
    const user = await ctx.em.findOne(User, { email });
    if (!user) {
      throw new ValidationError(`No user with email: ${email}`, {
        email: `No user with email: ${email}`,
      }, 400);
    }
    const code = generateCode();
    // await Mailer.sendForgotPasswordMail(email, { code });

    user.forgotPasswordCode = code;
    await ctx.em.save(user);

    return true;
  }

  @Mutation((returns) => LoginResponse)
  public async resetPassword(
    @Arg('forgotPasswordCode') forgotPasswordCode: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<LoginResponse> {
    const user = await ctx.em.findOne(User, { forgotPasswordCode });

    if (!user) {
      throw new ValidationError('Invalid Code', {
        forgotPasswordCode: 'Invalid Code',
      }, 400);
    }
    await user.update({
      password: newPassword,
    }, ctx);
    await ctx.em.save(user);

    const token = signUserToken(user);
    ctx.response!.cookie('token', token);

    return new LoginResponse(token, user);
  }

  @Mutation((returns) => Boolean)
  public async changePassword(
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() ctx: IRequestContext,
  ): Promise<boolean> {
    if (!ctx.auth) {
      throw new ServerError('Unauthorized', 401);
    }
    const { id } = ctx.auth.user;
    const user = await ctx.em.findOneOrFail(User, id);

    if (!await user.passwordMatches(oldPassword)) {
      throw new ValidationError('Old password doesn\'t match', {
        oldPassword: 'Old password doesn\'t match',
      }, 400);
    }

    await user.update({
      password: newPassword,
    }, ctx);

    await ctx.em.save(user);

    return true;
  }
}

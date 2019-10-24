import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import config from '../server/config';
import { User } from '../user/models/User';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 7);
}
export async function verifyPassword(plainPassword: string, hashedPassword?: string | null): Promise<boolean> {
  if (!hashedPassword) { return false; }

  return compare(plainPassword, hashedPassword);
}

function signToken(input: object) {
  return sign(input, config.jwtSecret);
}

export function signUserToken(user: User) {
  return signToken({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}

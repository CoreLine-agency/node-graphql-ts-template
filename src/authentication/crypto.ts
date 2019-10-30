import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import env from 'env-var';

import { User } from '../user/models/User';

const JWT_SECRET = env.get('JWT_SECRET').required().asString();

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 7);
}

export async function verifyPassword(plainPassword: string, hashedPassword?: string | null): Promise<boolean> {
  if (!hashedPassword) { return false; }

  return compare(plainPassword, hashedPassword);
}

function signToken(input: object) {
  return sign(input, JWT_SECRET);
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

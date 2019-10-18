import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

export function isDevEnv() {
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';
}

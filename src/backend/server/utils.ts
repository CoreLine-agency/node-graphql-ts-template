import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { File } from '../data/models/File';

export function isDevEnv() {
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';
}

export async function getFile(req: Request, res: Response) {
  const { slug } = req.params;

  const fileRepo = getRepository(File);

  const fileModel = await fileRepo.findOne({
    where: { slug },
    select: ['contentBase64'],
  });

  if (!fileModel) {
    return res.status(404).send('Not found');
  }

  const fileBuffer = Buffer.from(fileModel.contentBase64, 'base64');

  return res.end(fileBuffer);
}

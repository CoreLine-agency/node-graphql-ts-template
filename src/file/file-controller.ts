import { Request, Response, Application } from 'express';
import { getRepository } from 'typeorm';
import asyncWrapper from 'express-async-wrapper';

import { File } from './models/File';

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

export default (app: Application) => {
  app.get('/files/:slug', asyncWrapper(getFile));
}

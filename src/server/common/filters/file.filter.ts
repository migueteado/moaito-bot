import { Express, Request } from 'express';
import { extname } from 'path';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed'));
  }
  callback(null, true);
};

export const audioFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(mp3|ogg|wav)$/)) {
    return callback(new Error('Only audio files are allowed'));
  }
  callback(null, true);
};

export const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(mp4)$/)) {
    return callback(new Error('Only mp4 files are allowed'));
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(30)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};

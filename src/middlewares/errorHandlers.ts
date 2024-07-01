import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export function errorHandler(err: HttpException, res: Response) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  console.error(err);
  res.status(status).json({
    status,
    message,
  });
}

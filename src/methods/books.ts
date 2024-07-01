import { Book } from '../types/books.js';

export class BooksHelper {
  constructor() {}

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static isBook(obj: Record<string, any>): obj is Book {
    return typeof obj.title === 'string' && typeof obj.author === 'string';
  }
}

import { Book } from '../types/books.js';

export class BooksHelper {
  constructor() {}

  static isBook(obj: Record<string, any>): obj is Book {
    return typeof obj.title === 'string' && typeof obj.author === 'string';
  }
}

import { Request, Response, NextFunction, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '../types/books';
import { BooksHelper } from '../methods/books';
import { HttpException } from '../middlewares/errorHandlers';

const router = Router();

let books: Book[] = [];

router.get('', (req, res) => {
  res.json(books);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: bookId } = req.params;
    let bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      throw new HttpException(404, 'Book not found!');
    }
    return res.status(200).json({ data: books[bookIndex] });
  } catch (error) {
    next(error);
  }
});
// add book
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    let newBook = req.body;
    if (!BooksHelper.isBook(newBook)) {
      throw new HttpException(422, 'Invalid book format');
    }
    newBook.id = uuidv4();
    books.push(newBook);
    return res.status(201).json({ message: 'Book Added', data: newBook });
  } catch (err) {
    next(err); // Forward the error to the error handling middleware
  }
});

// delete book by its book ID
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: bookId } = req.params;
    if (!bookId) {
      throw new HttpException(422, 'A book Id is required!');
    }
    const initialLength = books.length;
    books = books.filter((book) => book.id !== bookId);

    if (books.length === initialLength) {
      throw new HttpException(400, 'Book not found');
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;

    if (!id) {
      throw new HttpException(422, 'A book Id is required!');
    }
    if (!title && !author) {
      throw new HttpException(422, 'No updatable field provided!');
    }

    let bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new HttpException(400, 'Book not found!');
    }

    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;

    return res.status(201).json({
      message: 'Book updated successfully!',
      data: books[bookIndex],
    });
  } catch (error) {
    next(error);
  }
});

export default router;

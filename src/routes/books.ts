import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '../types/books.js';
import { BooksHelper } from '../methods/books.js';

const router = Router();

let books: Book[] = [];

router.get('', (req, res) => {
  res.json(books);
});

// add book
router.post('', (req, res) => {
  let newBook = req.body;
  if (!BooksHelper.isBook(newBook)) {
    return res.status(422).json({ message: 'Invalid book format' });
  }
  newBook.id = uuidv4();
  books.push(newBook);
  return res.status(201).json({ message: 'Book Added', data: newBook });
});

// delete book by its book ID
router.delete('/:id', (req, res) => {
  const { id: bookId } = req.params;
  if (!bookId) {
    return res.status(422).json({ message: 'A book Id is required!' });
  }
  const initialLength = books.length;
  books = books.filter((book) => book.id !== bookId);

  if (books.length === initialLength) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json({ message: 'Book deleted successfully' });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;

  if (!id) {
    return res.status(422).json({ message: 'A book Id is required!' });
  }
  if (!title && !author) {
    return res.status(422).json({ message: 'No updatable field provided!' });
  }

  let bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found!' });
  }

  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;

  return res.status(200).json({
    message: 'Book updated successfully!',
    data: books[bookIndex],
  });
});

export default router;

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();

interface Book {
  id: string;
  title: string;
  author: string;
}

let books: Book[] = [];

function isBook(obj: any): obj is Book {
  return typeof obj.title === 'string' && typeof obj.author === 'string';
}

app.get('/api/books', (req, res) => {
  res.json(books);
});

// add book
app.post('/api/books', (req, res) => {
  let newBook = req.body;
  if (!isBook(newBook)) {
    return res.status(422).json({ message: 'Invalid book format' });
  }
  newBook.id = uuidv4();
  books.push(newBook);
  res.status(201).json({ message: 'Book Added' });
});

// delete book by its book ID
app.delete('/api/books', (req, res) => {
  const bookId: string = (req.query?.id as string) || '';
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

const server = app.listen(3030, () => {
  console.log('Server is listening on port 3030');
});

export { app, server };

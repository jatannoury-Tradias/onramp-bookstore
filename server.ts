import express from 'express';

const app = express();

let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 2,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
  },
];

app.get('/api/books', (req, res) => {
  res.json(books);
});

// delete book by ID
app.delete('/api/books', (req, res) => {
  const bookId: string = (req.query?.id as string) || '';
  if (!bookId) {
    return res.status(422).json({ message: 'A book Id is required!' });
  }
  const initialLength = books.length;
  books = books.filter((book) => book.id !== parseInt(bookId, 10));

  if (books.length === initialLength) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json({ message: 'Book deleted successfully' });
});

const server = app.listen(3030, () => {
  console.log('Server is listening on port 3030');
});

export { app, server };

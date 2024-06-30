import request from 'supertest';
import { app, server } from '../server';
import fs from 'fs';
import path from 'path';

type Book = {
  id: number;
  title: string;
  author: string;
};
let booksFixtures: Record<string, any>;

const loadFixture = (fixturePath: string): Book[] => {
  const filePath = path.join(__dirname, fixturePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

beforeAll(() => {
  booksFixtures = loadFixture('./fixtures/books.json');
});
afterAll((done) => {
  server.close(done);
});

describe('Post /api/books', () => {
  it('should fail to add a book', async () => {
    const response = await request(app).post('/api/books');
    expect(response.status).toBe(422);
  });
  it('should add a book', async () => {
    const response = await request(app)
      .post('/api/books')
      .send(booksFixtures.newBook);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});

describe('Get /api/books', () => {
  it('should return a list of books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    response.body.forEach((book: Book) => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
    });
  });
  it('should return a book by its Id', async () => {
    const addBookresponse = await request(app)
      .post('/api/books')
      .send(booksFixtures.newBook);
    const { id: addedBookId } = addBookresponse.body.data;
    const response = await request(app).get(`/api/books/${addedBookId}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title');
    expect(response.body.data).toHaveProperty('author');
  });

  it('should not return a book', async () => {
    const response = await request(app).get(`/api/books/test`);
    expect(response.status).toBe(404);
  });
});

describe('Delete /api/books', () => {
  it('should return a 404 status code', async () => {
    const response = await request(app).delete('/api/books?id=testingBookId1');
    expect(response.status).toBe(404);
  });
  it('should delete a book', async () => {
    const addBookresponse = await request(app)
      .post('/api/books')
      .send(booksFixtures.newBook);
    const { id: addedBookId } = addBookresponse.body.data;
    const getBookResponse = await request(app).get(`/api/books/${addedBookId}`);
    expect(getBookResponse.status).toBe(200);
    const deleteBookResponse = await request(app).delete(
      `/api/books/${addedBookId}`,
    );
    expect(deleteBookResponse.status).toBe(201);
  });
});

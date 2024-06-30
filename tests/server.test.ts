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

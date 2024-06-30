import express from 'express';
import bookRoutes from './src/routes/books.js';
import { errorHandler } from './src/middlewares/errorHandlers.js';

const app = express();
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use(errorHandler);

const server = app.listen(3030, () => {
  console.log('Server is listening on port 3030');
});

export { app, server };

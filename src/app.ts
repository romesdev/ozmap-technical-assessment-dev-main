import express from 'express';
import userRoutes from './routes/user.routes';
import regionRoutes from './routes/region.routes';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';

const app = express();

app.use(express.json());

// routes
app.use('/users', userRoutes);
app.use('/regions', regionRoutes);

// middlewares
app.use(errorHandlerMiddleware);

export default app;

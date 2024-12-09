import * as express from 'express';

import userRoutes from './routes/user.routes';
const app = express();
app.use(express.json());

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// Rotas
app.use('/users', userRoutes);

export default app;

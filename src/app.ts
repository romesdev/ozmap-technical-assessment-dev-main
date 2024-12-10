import express from 'express';
import userRoutes from './routes/user.routes';
import regionRoutes from './routes/region.routes';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use("/regions", regionRoutes);

export default app;

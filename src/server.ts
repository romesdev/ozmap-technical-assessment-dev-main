import app from './app';
import mongoose from 'mongoose';
import { envServerSchema } from './utils/env';

const { DB_HOST, DB_PORT, DB_NAME, API_PORT } = envServerSchema;

const MONGO_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecting to MongoDB');
    app.listen(API_PORT, () => console.log(`Server is running in ${API_PORT}`));
  })
  .catch((err) => console.error('Error on connect with DB', err));

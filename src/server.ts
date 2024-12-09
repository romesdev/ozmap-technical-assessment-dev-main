import app from './app';
import mongoose from 'mongoose';

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/ozmap';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connecting to MongoDB');
    app.listen(PORT, () => console.log(`Server is running in ${PORT}`));
  })
  .catch((err) => console.error('Error on connect with DB', err));

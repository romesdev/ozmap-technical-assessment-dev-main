import app from './app';
import mongoose from 'mongoose';

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/ozmap';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

import mongoose from 'mongoose';

const env = {
  MONGO_URI: 'mongodb://root:example@127.0.0.1:27021/oz-tech-test?authSource=admin',
};

const init = async function() {
  await mongoose.connect(env.MONGO_URI);
};

export default init();

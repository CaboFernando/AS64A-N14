import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI não definido');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
    maxPoolSize: 10
  });
  console.log('MongoDB conectado');
}
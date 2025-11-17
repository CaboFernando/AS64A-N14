import 'dotenv/config';
import { connectMongo } from './config/db.config.js';
import { initApp } from './app.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectMongo();
    const app = await initApp();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}

start();
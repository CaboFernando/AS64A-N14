import 'dotenv/config';
import { connectMongo } from './config/db.config.js';
import { initApp } from './app.js';
import https from 'https';
import fs from 'fs';

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 3443;

async function start() {
  try {
    await connectMongo();
    const app = await initApp();
    app.listen(PORT, () => {
      console.log(`Servidor HTTP rodando na porta ${PORT}`);
    });

    const privateKey = fs.readFileSync('/app/certs/nginx.key', 'utf8');
    const certificate = fs.readFileSync('/app/certs/nginx.crt', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, app).listen(HTTPS_PORT, () => {
      console.log(`Servidor HTTPS rodando na porta ${HTTPS_PORT}`);
    });
    
  } catch (e) {
    console.error('Falha ao iniciar', e);
    process.exit(1);
  }
}

start();
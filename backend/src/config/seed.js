import 'dotenv/config';
import { connectMongo } from './db.config.js';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.model.js';

async function runSeed() {
  try {
    console.log('Iniciando seed...');
    await connectMongo();
    console.log('Conectado ao MongoDB, verificando usuário...');
    
    const email = 'user@example.com';
    const existente = await Usuario.findOne({ email });
    if (existente) {
      console.log('Usuário já existe.');
      process.exit(0);
    }
    
    const senhaHash = await bcrypt.hash('senha123', 11);
    await Usuario.create({ nome: 'Usuário Demo', email, senhaHash });
    console.log('Seed OK: user@example.com / senha: senha123');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed:', error.message);
    setTimeout(() => {
      console.log('Tentando novamente em 5 segundos...');
      runSeed();
    }, 5000);
  }
}

runSeed().catch(e => {
  console.error('Erro seed', e);
  process.exit(1);
});
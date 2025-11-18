import 'dotenv/config';
import { connectMongo } from './db.config.js';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.model.js';
import { Filme } from '../models/filme.model.js';

async function runSeed() {
  await connectMongo();
  
  // Create demo user
  const email = 'user@example.com';
  let user = await Usuario.findOne({ email });
  
  if (!user) {
    const senhaHash = await bcrypt.hash('senha123', 11);
    user = await Usuario.create({ nome: 'Usuário Demo', email, senhaHash });
    console.log('Usuário criado: user@example.com / senha: senha123');
  } else {
    console.log('Usuário já existe.');
  }

  // Add some example movies
  const filmesExemplo = [
    { titulo: 'Matrix', descricao: 'Um hacker descobre a verdade sobre sua realidade e seu papel na guerra contra seus controladores.', ano: 1999 },
    { titulo: 'Inception', descricao: 'Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos.', ano: 2010 },
    { titulo: 'Interestelar', descricao: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço numa tentativa de garantir a sobrevivência da humanidade.', ano: 2014 },
    { titulo: 'O Senhor dos Anéis: A Sociedade do Anel', descricao: 'Um hobbit humilde herda um anel mágico e deve destruí-lo antes que um feiticeiro maligno o recupere.', ano: 2001 },
    { titulo: 'Vingadores: Ultimato', descricao: 'Após os eventos devastadores de Vingadores: Guerra Infinita, os heróis se reúnem mais uma vez.', ano: 2019 },
    { titulo: 'Parasita', descricao: 'Ganância e discriminação de classe ameaçam a relação simbiótica recém formada entre a rica família Park e o clã destituído Kim.', ano: 2019 },
    { titulo: 'O Poderoso Chefão', descricao: 'O patriarca idoso de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.', ano: 1972 },
    { titulo: 'Pulp Fiction', descricao: 'As vidas de dois assassinos de aluguel, um boxeador, um gângster e sua esposa se entrelaçam em quatro histórias de violência e redenção.', ano: 1994 },
  ];

  let filmesAdicionados = 0;
  for (const filmeData of filmesExemplo) {
    const existe = await Filme.findOne({ titulo: filmeData.titulo, ano: filmeData.ano });
    if (!existe) {
      await Filme.create({ ...filmeData, criadoPor: user._id });
      filmesAdicionados++;
    }
  }

  if (filmesAdicionados > 0) {
    console.log(`${filmesAdicionados} filmes de exemplo adicionados.`);
  } else {
    console.log('Filmes de exemplo já existem.');
  }

  console.log('Seed concluído com sucesso!');
  process.exit(0);
}

runSeed().catch(e => {
  console.error('Erro seed', e);
  process.exit(1);
});
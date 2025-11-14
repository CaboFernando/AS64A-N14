# AS64A-N14
 Repositório utilizado para entrega do projeto 2 da disciplina AS64A-N14


# Backend - Projeto 2 (AS64A-N14)

Implementa:
- Login / Logout (JWT + revogação via Redis)
- Busca e Inserção de filmes (autenticado)
- Cache de buscas (Redis)
- Segurança: helmet, rate limit, hash de senha
- Logging (coleção logs)
- Compressão de respostas

## Endpoints
POST /api/login  
POST /api/logout  
GET /api/filmes?query=&ano=  
POST /api/filmes  
GET /api/health

## Execução Local
1. Criar .env
2. npm install
3. npm run seed
4. npm start

## Execução via Docker Compose
docker compose build  
docker compose up -d  
curl http://localhost:3000/api/health

## Usuário Seed
email: user@example.com  
senha: senha123
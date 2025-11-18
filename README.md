# AS64A-N14 – Projeto 2

Este repositório entrega:
- SPA React (TMDBapi-app) adaptada para Login, Busca e Inserção em dados locais.
- Backend Express (REST) com MongoDB e Redis (cache + revogação de tokens).
- Segurança: JWT, hashing de senha, rate limit, helmet, validação servidor.
- Otimização: compressão, cache, estrutura REST.
- Execução via Docker Compose ou local.

## Serviços

| Serviço   | Porta | Função                    |
|-----------|-------|---------------------------|
| backend   | 3000  | API REST (login, filmes)  |
| frontend  | 8080  | SPA (Nginx)               |
| mongo     | 27017 | Banco de dados            |
| redis     | 6379  | Cache / revogação tokens  |

## Endpoints Principais

- POST /api/login - Autenticação de usuário
- POST /api/logout - Revogação de token
- GET /api/filmes?query=&ano= - Busca de filmes (protegido)
- POST /api/filmes - Inserção de filme (protegido)
- GET /api/health - Verificação de status

## Subir Ambiente (Docker)

```bash
docker compose build
docker compose up -d
docker compose logs -f backend
```

Acesse o frontend em: http://localhost:8080

## Execução Local (Desenvolvimento)

### Backend

```bash
cd backend
npm install
# Configure as variáveis de ambiente (veja .env.example)
cp .env.example .env
# Certifique-se que MongoDB e Redis estão rodando
npm run seed  # Cria usuário demo e filmes de exemplo
npm run dev   # Inicia com hot reload
```

### Frontend

```bash
cd frontend/TMDBapi-app
npm install
npm run dev   # Inicia servidor de desenvolvimento
```

Acesse: http://localhost:5173

## Credenciais Demo

- **Email:** user@example.com
- **Senha:** senha123

## Testes Rápidos

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","senha":"senha123"}'

# Buscar filmes (substitua TOKEN pelo token recebido no login)
curl http://localhost:3000/api/filmes?query=Matrix \
  -H 'Authorization: Bearer TOKEN'

# Inserir filme
curl -X POST http://localhost:3000/api/filmes \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{"titulo":"Novo Filme","descricao":"Descrição do filme","ano":2024}'
```

## Limpar

```bash
docker compose down
docker compose down -v   # remove volumes e dados
```

## Funcionalidades Implementadas

- [x] Login funcionando (token JWT)
- [x] Logout revoga token
- [x] Busca protegida retorna resultados do banco
- [x] Inserção protegida grava no banco
- [x] Cache Redis ativo (origem cache em segunda busca)
- [x] Rate limit em /api/login
- [x] Helmet + compressão
- [x] Validações servidor (mensagens de erro)
- [x] Logging em coleção logs
- [x] SPA consumindo rotas do backend
- [x] CORS configurado para comunicação frontend/backend
- [x] Seed com dados de exemplo (usuário + filmes)
- [x] Frontend build para produção funcionando

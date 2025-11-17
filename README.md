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

- POST /api/login
- POST /api/logout
- GET /api/filmes?query=&ano=
- POST /api/filmes
- GET /api/health

## Subir Ambiente (Docker)

```bash
docker compose build
docker compose up -d
docker compose logs -f backend
```

## Testes Rápidos

```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"user@example.com","senha":"senha123"}'
```

## Limpar

```bash
docker compose down
docker compose down -v   # remove volumes e dados
```

## Checklist

- [ ] Login funcionando (token JWT)
- [ ] Logout revoga token
- [ ] Busca protegida retorna resultados do banco
- [ ] Inserção protegida grava no banco
- [ ] Cache Redis ativo (origem cache em segunda busca)
- [ ] Rate limit em /api/login
- [ ] Helmet + compressão
- [ ] Validações servidor (mensagens de erro)
- [ ] Logging em coleção logs
- [ ] SPA consumindo rotas do backend
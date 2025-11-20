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


✅ Status Final e Correções de Execução

- O projeto está completo, estável e totalmente funcional, seguindo a arquitetura de 3 camadas:

- Front-end: React

- Back-end: Express

- Banco/Cache: MongoDB + Redis

- Orquestração: Docker Compose

🔧 Alterações Principais
1. Infraestrutura e Login (Erro 405 Resolvido)

- O arquivo frontend/TMDBapi-app/nginx.conf foi reescrito totalmente em ASCII, removendo caracteres inválidos que impediam o Nginx de iniciar.

- Adicionado o bloco:
```bash
location /api/ {
    proxy_pass http://backend:3000;
}
```

2. Front-end e Build (Tela em Branco Corrigida)

- Ponto de Entrada Criado:
Adicionado src/main.jsx com createRoot, garantindo a inicialização correta do React 18.

- Importações Ajustadas:
Todos os caminhos incorretos ../context/ foram corrigidos para ../contexts/.

- Bootstrap Removido do Build e Movido para CDN:
Adicionado diretamente no index.html para evitar erros no processo de build.

- Busca Interna Corrigida:
O arquivo UploadForm.jsx agora utiliza a rota local:
```bash
/api/filmes
```

# Projeto 2 - Catálogo de Filmes Fullstack (AS64A)

Aplicação Web completa desenvolvida para a disciplina de **Programação Web Fullstack**. O sistema implementa uma arquitetura de 3 camadas segura e otimizada, permitindo autenticação de usuários, busca e catalogação de filmes.

## 🚀 Tecnologias e Arquitetura

O projeto foi orquestrado utilizando **Docker Compose** e segue a seguinte estrutura:

* **Frontend (SPA):** React.js (Vite) + Bootstrap. Servido via **Nginx**.
* **Backend (API REST):** Node.js + Express 5.
* **Banco de Dados:** MongoDB (com persistência via volumes).
* **Cache/Sessão:** Redis (gerenciamento de *blacklist* de tokens).

## 📋 Funcionalidades Implementadas

### Requisitos Funcionais
1.  **Login:** Autenticação via JWT (JSON Web Token).
2.  **Busca:** Pesquisa de filmes por título e ano (dados locais do MongoDB).
3.  **Inserção:** Cadastro de novos filmes (protegido por autenticação).

### Requisitos Não-Funcionais (Segurança e Performance)
* 🔒 **HTTPS (TLS/SSL):** Configurado no Nginx com certificados autoassinados (Porta 8443).
* 🛡️ **Proteção contra Injeção (NoSQL Injection):** Sanitização automática de `req.body`, `req.query` e `req.params` utilizando `mongo-sanitize`.
* 🤖 **Rate Limiting:** Proteção contra ataques de força bruta na rota de login (10 tentativas/15min).
* 🚪 **Logout Seguro:** Revogação real de tokens utilizando *blacklist* no Redis.
* 📝 **Auditoria:** Logs de segurança (tentativas de login, inserções) registrados no banco.
* 🚀 **Compressão (Gzip):**
    * **Frontend:** Arquivos estáticos comprimidos no *build* (Vite) e servidos via `gzip_static` no Nginx.
    * **Backend:** Respostas da API comprimidas via middleware `compression`.
* 🔌 **Connection Pooling:** Gerenciamento eficiente de conexões MongoDB.

## 🛠️ Como Executar

### Pré-requisitos
* Docker
* Docker Compose

### Passo a Passo

1. **Clone o repositório e acesse a pasta:**
   ```bash
   git clone https://github.com/CaboFernando/AS64A-N14
   cd AS64A-N14
````

2.  **Suba o ambiente (Build + Start):**

    ```bash
    docker-compose up --build
    ```

3.  **Acesse a aplicação:**

      * Abra o navegador em: **[https://localhost:8443](https://www.google.com/search?q=https://localhost:8443)**
      * *Nota:* Como o certificado é autoassinado (ambiente de dev), o navegador exibirá um alerta de segurança. Clique em "Avançado" -\> "Ir para localhost (inseguro)".

### 🔑 Credenciais de Teste (Seed)

O sistema cria automaticamente um usuário padrão ao iniciar:

  * **Email:** `user@example.com`
  * **Senha:** `senha123`

-----

## 📂 Estrutura do Projeto

```
/
├── backend/
│   ├── src/
│   │   ├── config/       # Configs de DB, Redis, Segurança
│   │   ├── models/       # Schemas Mongoose (Usuario, Filme, Log)
│   │   ├── routes/       # Rotas e Controladores (Auth, Filmes)
│   │   └── app.js        # Configuração do Express (Middlewares)
│   └── Dockerfile
│
├── frontend/TMDBapi-app/
│   ├── src/              # Componentes React, Contexts
│   ├── nginx.conf        # Configuração do Proxy Reverso e HTTPS
│   ├── vite.config.js    # Configuração de Build e Compressão
│   └── Dockerfile
│
├── certs/                # Certificados SSL para o Nginx
└── docker-compose.yml    # Orquestração dos serviços
```

## ✅ Endpoints da API (Backend)

A API roda internamente na porta 3000, mas é exposta pelo Nginx via proxy.

  * `POST /api/login` - Autenticação.
  * `POST /api/logout` - Revogação de token.
  * `GET /api/filmes` - Busca (Query params: `query`, `ano`).
  * `POST /api/filmes` - Inserção.
  * `GET /api/health` - Check de saúde.

-----

**Autores:** Carlos Fernando dos Santos & André Faria

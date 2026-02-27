# Node Passport API (Basic + JWT)

API simples para praticar autenticação com **Passport.js**, desenvolvida durante o curso de Node.js da **B7Web**.

Depois do curso, o projeto foi **vastamente aprimorado**, com foco em:
- tratamento de erros mais robusto (middleware central + `HttpError`)
- tipagem mais forte (interfaces/types)
- utilitários/helpers para reduzir duplicação
- separação de responsabilidades (controllers, services, strategies, middlewares)

## Tecnologias

- Node.js + **TypeScript**
- **Express**
- **Passport**
  - `passport-http` (**Basic Strategy**)
  - `passport-jwt` (**JWT Strategy**)
- **jsonwebtoken**
- **bcrypt**
- **Sequelize** + **PostgreSQL**
- **dotenv**
- **tsx** (dev com watch)

## Rotas (resumo)

- `GET /ping` → healthcheck
- `POST /register` → cria usuário e retorna token JWT
- `POST /login` → autentica usuário e retorna token JWT
- `GET /list` → rota privada (exige **Bearer token**)

## Estrutura do projeto (visão geral)

- `src/server.ts`  
  Inicializa Express, Passport, rotas, 404 e error handler.
- `src/config/passport.config.ts`  
  Centraliza a configuração do Passport (ex.: registra a JWT strategy).
- `src/auth/strategies`  
  Estratégias do Passport (`basic.strategy.ts`, `jwt.strategy.ts`).
- `src/auth/services`  
  Regras de negócio/serviços (`user.service.ts`, `credentials.service.ts`).
- `src/controllers`  
  Controllers HTTP (`api.controller.ts`, `404.controller.ts`).
- `src/middlewares`  
  Middleware de rota privada (`privateRoute`) + error handler.
- `src/helpers`  
  Helpers utilitários (ex.: parse/validação de credenciais, geração de JWT).
- `src/errors`  
  Erro customizado `HttpError`.
- `src/models` / `src/instances`  
  Sequelize model + conexão com Postgres.
- `src/interfaces` / `src/types`  
  Tipos e contratos para padronizar respostas/retornos.

## Variáveis de ambiente

Crie um `.env`:

```env
PORT=3000

JWT_SECRET_KEY=sua_chave_secreta
SALT_ROUNDS=10

PG_DB=seu_banco
PG_USER=seu_usuario
PG_PASSWORD=sua_senha
PG_HOST=localhost
PG_PORT=5432
```

## Como rodar

```bash
npm install
npm run dev
```

Servidor em: `http://localhost:${PORT}`

## Exemplo rápido

### Register
```http
POST /register
Content-Type: application/json

{
  "email": "email@teste.com",
  "password": "123456"
}
```

### Login
```http
POST /login
Content-Type: application/json

{
  "email": "email@teste.com",
  "password": "123456"
}
```

### Rota privada (JWT)
```http
GET /list
Authorization: Bearer SEU_TOKEN_AQUI
```

## Melhorias em relação ao projeto original do curso

- Estratégias do Passport separadas por responsabilidade (Basic/JWT)
- Services com retornos padronizados (`ServiceResult<T>`)
- Middleware privado com verificação de header + `WWW-Authenticate`
- `HttpError` para padronizar erros de domínio/HTTP
- Error handler centralizado (inclui caso de **JSON inválido**)
- Helpers utilitários (parse de credenciais e geração de token)

## Créditos

Projeto base feito no curso de Node.js da [B7Web](https://b7web.com.br/).  

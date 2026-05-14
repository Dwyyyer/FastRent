# FastRent

## O que é este projeto

FastRent é uma plataforma digital que conecta usuários a veículos disponíveis para aluguel e assinatura mensal, permitindo que clientes escolham, contratem e recebam um carro diretamente pelo aplicativo.

Por meio de um aplicativo intuitivo, os usuários podem selecionar o veículo desejado, escolher planos de assinatura ou locação, assinar contratos digitalmente e receber o carro em casa por meio de um funcionário da empresa.

A plataforma utiliza tecnologia de geolocalização, gestão de frota e assinatura digital, garantindo praticidade, segurança e agilidade em todo o processo de locação.

## Como rodar

1. Instale Docker Desktop
2. Clone o repositório
3. Rode:

```bash
docker compose up --build
```

## Stack escolhida

- Banco: **PostgreSQL**
- Backend: **Node.js / Express**
- Frontend: **Vue MPA**

## Estrutura funcional

As entidades de exemplo são:
- `categories`
- `products`

As rotas REST esperadas no backend são:
- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

## Portas e acessos

- Backend REST: http://localhost:8000
- Frontend: http://localhost:3000
- Banco (postgres): http://localhost:5432
- Administração do banco: http://localhost:8080

## Credenciais iniciais

**Banco Postgres**

- User: admin
- Senha: admin

**pgAdmin**

- pgAdmin email: admin@admin.com
- pgAdmin senha: admin123

Conection:

- Host name/address: db
- Port: 5432
- Maintenance database: fastrent
- Username: admin
- Password: admin

## Onde alterar

- Banco e dados iniciais: `database/init/01-schema.sql`
- Backend Node: `backend/src/server.js`
- Frontend Vue MPA: `frontend/src/` e arquivos `.html` na raiz de `frontend/`
- Infra e portas: `docker-compose.yml` e `.env`

## Healthchecks

- Banco: usa healthcheck nativo do container do banco.
- Backend: só fica `healthy` se responder HTTP e conseguir consultar o banco.
- Frontend: só fica `healthy` se subir localmente e conseguir acessar o health do backend.

## Arquivos importantes

- `docker-compose.yml`: orquestração principal
- `.env`: variáveis ativas do ambiente
- `.env.example`: cópia de referência das variáveis
- `database/init/01-schema.sql`: criação das tabelas e carga inicial
- `backend/`: API escolhida
- `frontend/`: interface escolhida
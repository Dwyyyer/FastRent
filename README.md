# FastRent

## O que é este projeto

FastRent é uma plataforma digital que conecta usuários a veículos disponíveis para aluguel e assinatura mensal, permitindo que clientes escolham, contratem e recebam um carro diretamente pelo aplicativo.

Por meio de um aplicativo intuitivo, os usuários podem selecionar o veículo desejado, escolher planos de assinatura ou locação, assinar contratos digitalmente e receber o carro em casa por meio de um funcionário da empresa.

A plataforma utiliza tecnologia de geolocalização, gestão de frota e assinatura digital, garantindo praticidade, segurança e agilidade em todo o processo de locação.

## Autores
- Daniel Tiburcio de Araújo - 5163949
- Gabriel Buzollo Lininberg - 5167865
- Kaike Garcia Oliveira - 5168489
- Pedro Henrique Oliveira de Almeida - 5167409
- Pedro Paulo de Souza Talala – 5155207
- Rayson Aparecido Mariano Nunes - 5166854

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

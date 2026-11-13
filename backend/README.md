# Fiado Digital API

API REST do Gerenciador de Fiado Digital, construída com Node.js, TypeScript,
Express 5, PostgreSQL e Prisma ORM 7.

## Arquitetura

O código é organizado por domínio. Cada módulo mantém suas rotas, validações,
controllers, serviços e repositórios próximos uns dos outros:

```text
src/
├── config/                 # Variáveis de ambiente validadas
├── lib/                    # Prisma e logger
├── modules/
│   ├── auth/               # Cadastro, login e sessão
│   ├── customers/          # Clientes do comércio
│   ├── dashboard/          # Indicadores e visão geral
│   ├── health/             # Saúde e prontidão da API
│   ├── movements/          # Fiados e pagamentos
│   └── stores/             # Dados do comércio
├── routes/                 # Composição das rotas
├── shared/                 # Erros, middlewares, tipos e utilitários
├── app.ts                  # Configuração HTTP
└── server.ts               # Inicialização e encerramento do servidor
```

O fluxo de uma requisição segue:

```text
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Controller:** interpreta HTTP e valida a entrada com Zod.
- **Service:** concentra as regras de negócio.
- **Repository:** isola o acesso ao banco de dados.
- **Presenter:** converte os modelos internos para o contrato público da API.

## Requisitos

- Node.js 24+
- Docker com Docker Compose, ou um PostgreSQL acessível

## Configuração local

No PowerShell, a partir da pasta `backend`:

```powershell
Copy-Item .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

A API ficará disponível em `http://localhost:3333`.

Usuário criado pelo seed:

```text
E-mail: demo@fiadodigital.com.br
Senha:  Demo@123
```

Troque as credenciais e a chave JWT antes de qualquer implantação real.

## Rotas

Todas as respostas usam JSON. As rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer <accessToken>
```

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Não | Verifica o processo da API |
| `GET` | `/api/v1/health/ready` | Não | Verifica a conexão com o PostgreSQL |
| `POST` | `/api/v1/auth/register` | Não | Cria comerciante e comércio |
| `POST` | `/api/v1/auth/login` | Não | Autentica e devolve JWT |
| `GET` | `/api/v1/auth/me` | Sim | Retorna usuário e comércio atuais |
| `GET` | `/api/v1/store/me` | Sim | Consulta o comércio |
| `PATCH` | `/api/v1/store/me` | Sim | Atualiza o comércio |
| `GET` | `/api/v1/customers` | Sim | Lista e filtra clientes |
| `POST` | `/api/v1/customers` | Sim | Cadastra cliente |
| `GET` | `/api/v1/customers/:customerId` | Sim | Consulta cliente e histórico |
| `PATCH` | `/api/v1/customers/:customerId` | Sim | Atualiza cliente |
| `DELETE` | `/api/v1/customers/:customerId` | Sim | Arquiva cliente sem dívida |
| `POST` | `/api/v1/customers/:customerId/sales` | Sim | Registra compra no fiado |
| `POST` | `/api/v1/customers/:customerId/payments` | Sim | Registra pagamento |
| `GET` | `/api/v1/movements` | Sim | Lista movimentações |
| `GET` | `/api/v1/dashboard/summary` | Sim | Retorna indicadores do dashboard |

### Exemplos

Cadastro de comerciante:

```json
{
  "name": "Maria Souza",
  "email": "maria@example.com",
  "password": "Senha123",
  "store": {
    "name": "Mercadinho da Maria",
    "city": "Manaus",
    "state": "AM"
  }
}
```

Novo fiado:

```json
{
  "amount": 85.9,
  "description": "Mercado e bebidas",
  "occurredOn": "2026-11-13"
}
```

Pagamento:

```json
{
  "amount": 50,
  "description": "Pagamento em dinheiro"
}
```

## Regras implementadas

- Todos os clientes e movimentos são isolados pelo comércio autenticado.
- Valores monetários usam `DECIMAL(12,2)` no PostgreSQL.
- Um pagamento não pode exceder o saldo em aberto.
- Os pagamentos liquidam as compras mais antigas primeiro.
- Clientes com dívida não podem ser arquivados.
- Telefones são normalizados para impedir cadastros duplicados por formatação.
- Datas futuras não são aceitas em movimentações.
- Senhas são armazenadas com hash bcrypt e nunca retornam pela API.
- Erros e validações seguem um formato JSON consistente.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API com recarga automática |
| `npm run build` | Compila para `dist/` |
| `npm start` | Executa a versão compilada |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos |
| `npm test` | Executa os testes automatizados |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run db:migrate -- --name nome` | Cria e aplica uma migration de desenvolvimento |
| `npm run db:deploy` | Aplica migrations existentes |
| `npm run db:seed` | Insere os dados de demonstração |
| `npm run db:studio` | Abre o Prisma Studio |

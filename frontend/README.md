# Gerenciador de Fiado Digital

Aplicação web para organizar o fiado de um estabelecimento. A interface reúne o
resumo da loja, clientes, vendas, pagamentos e cobranças. Os dados são consumidos
da API Express e persistidos em PostgreSQL.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- TanStack Query
- Zustand
- Progressive Web App (manifesto e service worker)

## Estrutura do projeto

```text
.
├── public/
│   ├── icon-192.png              # Ícone PWA de 192 px
│   ├── icon-512.png              # Ícone PWA de 512 px
│   ├── icon.svg                  # Ícone vetorial
│   ├── manifest.webmanifest      # Nome, tema e ícones do aplicativo
│   └── sw.js                     # Cache de recursos e suporte offline
├── .figma/
│   └── make/
│       └── site.json             # Metadados usados pela configuração do Vite
├── src/
│   ├── app/                      # Composição e providers globais
│   ├── components/               # Layout e componentes reutilizáveis
│   ├── features/                 # Domínios: auth, clientes, dashboard e movimentos
│   ├── lib/                      # Cliente HTTP e formatadores
│   ├── stores/                   # Estado de sessão e navegação com Zustand
│   ├── types/                    # Contratos da API
│   ├── index.css                 # Estilos globais e responsivos
│   └── main.tsx                  # Inicialização do React
├── index.html                    # Documento HTML principal
├── package.json                  # Dependências e comandos npm
├── tsconfig.json                 # Configuração do TypeScript
└── vite.config.ts                # Configuração do Vite e plugins
```

## Executar localmente

Crie um `.env` a partir do exemplo, instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

O Vite informa no terminal o endereço local para abrir no navegador.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com atualização automática. |
| `npm run build` | Gera a versão de produção em `dist/`. |
| `npm run preview` | Inicia uma prévia local da versão compilada. |
| `npm run format` | Formata os arquivos usando o Oxfmt. |

## Observações

- A API deve estar disponível na URL definida por `VITE_API_URL`.
- Apenas a sessão autenticada é mantida no navegador; os dados do comércio ficam
  no PostgreSQL.
- O service worker é registrado apenas em produção. O cache offline depende da
  versão publicada do aplicativo.
- TanStack Query gerencia cache, carregamento e invalidação dos dados remotos.
- Zustand gerencia somente autenticação e navegação local da interface.

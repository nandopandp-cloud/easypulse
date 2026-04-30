# EasyPulse — Gestão de Avaliações de Pulso Educacional

SaaS para registrar, acompanhar e analisar avaliações de pulso aplicadas em redes
educacionais. Construído com **Next.js (App Router) + TypeScript + TailwindCSS +
Shadcn/UI + Prisma + PostgreSQL**.

## Funcionalidades

- Autenticação por e-mail e senha com sessão JWT em cookie httpOnly
- Perfis **USER** (vê apenas as próprias avaliações) e **ADMIN** (vê tudo)
- CRUD completo de avaliações com validação Zod (cliente e servidor)
- Reagendamento dedicado com motivo obrigatório e histórico de eventos
- Listagem com busca textual, filtros (status, região, escola), paginação
- Exportação em **CSV** e **PDF** respeitando filtros e permissões
- Dashboard com métricas (total, % concluídas, % reagendadas, próximas)
- Layout responsivo (cards no mobile, tabelas no desktop), dark mode, skeletons,
  toasts e estados vazios — alinhado às heurísticas de Nielsen

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| UI | TailwindCSS, Shadcn/UI (Radix), lucide-react, sonner |
| Backend | Server Actions + Route Handlers (Next.js) |
| Auth | JWT (jose) + bcryptjs + middleware Edge |
| Banco | PostgreSQL (Neon) via Prisma ORM |
| Exportação | jsPDF + jspdf-autotable, CSV nativo |

## Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- PostgreSQL — qualquer provedor com `DATABASE_URL` (Neon, Supabase, Railway, local)

## Configuração

```bash
cp .env.example .env
# Edite .env com sua DATABASE_URL e gere um AUTH_SECRET forte:
# openssl rand -base64 48
```

Variáveis:

- `DATABASE_URL` — string de conexão Postgres
- `AUTH_SECRET` — chave usada para assinar os JWTs de sessão (>= 16 chars)

## Rodando localmente

```bash
npm install
npm run db:push     # cria tabelas (ou: npm run db:migrate -- --name init)
npm run db:seed     # popula com usuários e avaliações de exemplo
npm run dev
```

Acesse http://localhost:3000.

### Contas de demonstração (seed)

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin | `admin@easypulse.app` | `admin123` |
| Usuária | `ana@easypulse.app` | `user123` |
| Usuário | `carlos@easypulse.app` | `user123` |

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera Prisma Client e build de produção |
| `npm start` | Sobe build de produção |
| `npm run lint` | Lint com ESLint |
| `npm run db:push` | Aplica o schema Prisma ao banco |
| `npm run db:migrate` | Cria/aplica migrações |
| `npm run db:seed` | Popula o banco com dados de exemplo |

## Estrutura

```
src/
  app/
    (auth)/login          # tela de login
    (auth)/register       # tela de cadastro
    (app)/dashboard       # métricas e próximas avaliações
    (app)/evaluations     # listagem + filtros + paginação
    (app)/evaluations/new # criação
    (app)/evaluations/[id]            # detalhes + histórico
    (app)/evaluations/[id]/edit       # edição
    actions/                          # server actions (auth + evaluations)
    api/evaluations/export/{csv,pdf}  # exportações
  components/             # UI (shadcn) + AppShell, ThemeToggle, StatusBadge
  lib/                    # prisma, auth, evaluations, validators, utils
  middleware.ts           # proteção de rotas e redirect autenticado
prisma/
  schema.prisma           # users, evaluations, evaluation_events
  seed.ts                 # dados iniciais
```

## Permissões

A camada de dados (`src/lib/evaluations.ts`) e as server actions
(`src/app/actions/evaluations.ts`) aplicam o filtro de propriedade em **todos**
os reads e writes:

- **USER** → `userId = session.sub` em listagem, leitura, update, delete e export
- **ADMIN** → sem restrição de `userId`

O middleware Edge (`src/middleware.ts`) bloqueia rotas autenticadas e redireciona
para `/login` quando não há sessão válida.

## Reagendamento

Quando o status é **RESCHEDULED**, o campo "motivo" é obrigatório (validado por
Zod no servidor e exigido na UI). Cada criação, edição, mudança de status e
reagendamento gera um registro em `evaluation_events`, exibido na linha do tempo
da página de detalhes.

## Deploy

O projeto roda em qualquer provedor compatível com Next.js (Vercel, Render,
Fly.io). Apenas garanta:

1. `DATABASE_URL` e `AUTH_SECRET` definidas como variáveis de ambiente
2. `prisma migrate deploy` (ou `prisma db push`) executado contra o banco de produção
3. Build padrão `npm run build` (já dispara `prisma generate`)
